const path = require('path')
const fs = require('fs')
const vm = require('vm')

function Module(id) {
  this.id = id;
  this.exports = {}
}

Module._cache = {}

function tryModuleLoad(module) {
  // 尝试加载模块
  let ext = path.extname(module.id);
  Module.extensions[ext](module)
}

Module._resolveFilename = function (id) {
  const dirname = path.dirname(__filename)
  let absPath = path.resolve(dirname, id)

  if (fs.existsSync(absPath)) {
    return absPath
  }

  let extensions = Object.keys(Module.extensions);
  for (let i = 0; i < extensions.length; i++) {
    let ext = extensions[i];
    let currentPath = absPath + ext;
    let exits = fs.existsSync(currentPath);
    if (exits) {
      return currentPath;
    }
  }
  throw new Error('文件不存在')
}
let wrapper = [
  '(function (exports, require, module, __dirname, __filename) {\r\n',
  '\r\n})'
]
// debugger;
Module.extensions = {
  ['.js']: function (module) {
    // 1) 读取
    let script = fs.readFileSync(module.id, 'utf8');
    // 2) 增加函数 还是一个字符串
    let content = wrapper[0] + script + wrapper[1];
    // 3) 让这个字符串函数执行 (node里api)
    let fn = vm.runInThisContext(content); // 这里就会返回一个js函数
    let __dirname = path.dirname(module.id);
    // 让函数执行
    fn.call(module.exports, module.exports, req, module, __dirname, module.id)
  },
  ['.json']: function (module) {
    let script = fs.readFileSync(module.id, 'utf8');
    module.exports = JSON.parse(script)
  }
}

function req(id) {
  // 相对路径获得绝对路径
  let filename = Module._resolveFilename(id);
  let cache = Module._cache[filename];
  // 如果有缓存
  if (cache) {
    return cache.exports;
  }
  // 创建模块实例
  let module = new Module(filename);
  Module._cache[filename] = module;
  // 加载模块（实际上就是给modules.exports赋值）
  tryModuleLoad(module); // module.exports = {}
  return module.exports;
}

let a = req('./a')
console.log(a)

let b = req('./b')
console.log(b)

/**
 * 让我们回顾一下，require的实现流程：
 * 拿到要加载的文件绝对路径。没有后缀的尝试添加后缀
 * 尝试从缓存中读取导出内容。如果缓存有，返回缓存内容。没有，下一步处理新建一个模块实例，并输入进缓存对象
 * 尝试加载模块
 * 根据文件类型，分类处理
 * 如果是js文件，读取到文件内容，拼接自执行函数文本，用vm模块创建沙箱实例加载函数文本，获得导出内容，返回内容
 * 如果是json文件，读取到文件内容，用JSON.parse 函数转成js对象，返回内容
 * 获取导出返回值。
 */