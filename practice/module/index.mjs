import a from './a.mjs'
import { createRequire } from 'module'
// const require = createRequire(import.meta.url)
const require = createRequire(import.meta.url)
console.log('%c 🍶 import.meta.url: ', 'font-size:20px;background-color: #EA7E5C;color:#fff;', import.meta.url);
const { b } = require('./cjs.js')
console.log('%c 🍯 b: ', 'font-size:20px;background-color: #FCA650;color:#fff;', b);
// const a = require('./a.mjs')
console.log(a)