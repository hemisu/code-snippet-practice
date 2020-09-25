const { request } = require("express");

class Scheduler {
  constructor() {
    this.cbs = []
    this.max = 2
    this.cnt = 0
    this.idle = 0
  }
  add(promiseCreator) {
    this.cbs.push(promiseCreator)
  }

  request() {
    if(!this.cbs || !this.cbs.length || this.idle >= this.max) {
      return
    }
    this.idle++
    const p = this.cbs.shift()
    console.log('%c 🍛 p: ', 'font-size:20px;background-color: #B03734;color:#fff;', p);
    p().finally(() => {
      this.idle--
      this.request()
    })
  }

  start() {
    for(let i = 0; i < this.max; i++) {
      this.request.bind(this)()
    }
  }
}

const timeout = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

const scheduler = new Scheduler()
const addTask = (time, order) => {
  scheduler.add(() => timeout(time).then(() => console.log(order)))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(200, '4')
// output: 2 3 1 4

scheduler.start()

