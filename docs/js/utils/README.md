# 工具类函数

## 获取process.argv

捕获命令行参数

```bash
node a.js --a -src 'path1/path2'
```

输出
```js
{
  a: true,
  src: 'path1/path2'
}
```

## 多张图变成sprite图+css文件

demo: 
```bash
cd imgs2sprite
# src 图源，会输出到dist目录
gulp -f gulp.sprite.js -src './src/circle/*.png'
```

指定输出路径 
```bash
cd imgs2sprite
# src 图源，会输出到dist目录
gulp -f gulp.sprite.js -src './src/circle/*.png' -dist './dist/circle'
```

## gif变成sprite

demo:
```bash
cd gif2sprite
node index.js -src './src/gif/line.gif'
```