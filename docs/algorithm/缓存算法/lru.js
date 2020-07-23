const assert = require('assert')


function LRU (max) {
  if(!max) throw Error('必须输入大于 0 的缓存值')

  var size = 0
  var cache = Object.create(null)
  var _cache = Object.create(null)

  function update (key, value) {
    cache[key] = value
    size++
    if (size >= max) {
      size = 0
      _cache = cache
      cache = Object.create(null)
    }
  }

  return {
    has(key) {
      return cache[key] !== undefined || _cache[key] !== undefined
    },
    remove(key) {
      if(cache[key] !== undefined) {
        cache[key] = undefined
      }
      if(_cache[key] !== undefined) {
        _cache[key] = undefined
      }
    },
    get(key) {
      var v = cache[key]
      if(v !== undefined) return v
      if((v = (_cache[key])) !== undefined) {
        update(key, v)
        return v
      }
    },
    // 增加新的 kv pair，如果不存在就set new_cache，已存在就 update 一下
    set(key, value) {
      if(cache[key] !== undefined) cache[key] = value
      else update(key, value)
    },
    clear() {
      cache = Object.create(null)
      _cache = Object.create(null)
    }
  }
}

const lru = new LRU(2)

// set-get
lru.set('test', 'test')
assert.equal(lru.get('test'), 'test')
// has
assert.equal(lru.has('test'), true)
assert.equal(lru.has('blah'), false)
// update
lru.set('test', 'test2')
assert.equal(lru.get('test'), 'test2')
// cache cycle
lru.set('test2', 'test')

assert.equal(lru.get('test2'), 'test')
assert.equal(lru.get('test'), 'test2')

// max validation:
assert.throws(LRU)

// remove
assert.equal(lru.has('test2'), true)
lru.remove('test2')
assert.equal(lru.has('test2'), false)

// clear
assert.equal(lru.has('test'), true)
lru.clear()
assert.equal(lru.has('test'), false)