const { Readable, Writable } = require('stream')
const fs = require('fs')
const jsonFiles = [
  './a.json',
  './b.json',
  './c.json',
]

function requireJson(jsonFile) {
  const content = fs.readFileSync(jsonFile)
  return JSON.parse(content)
}

class JSONStream extends Writable {
  constructor(options = {}) {
    options.highWatermark = 20
    options.objectMode = true
    super(options)
    this._result = {}
  }

  get result() {
    return this._result
  }

  _write(jsonFile, _, cb) {
    Object.assign(this._result, requireJson(jsonFile))
    cb()
  }
}

const readable = new Readable({ objectMode: true })
const writable = new JSONStream()

for (const jsonFile of jsonFiles) {
  readable.push(jsonFile)
}
readable.push(null)

readable.pipe(writable)
  .on('finish', () => console.log(writable.result))