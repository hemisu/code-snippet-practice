const protocol = '(?<protocol>https?:)'
const host = '(?<host>(?<hostname>[^/#?:]+)(?::(?<port>\\d+))?)'
const path = '(?<pathname>(?:\\/[^/#?]+)*\\/?)'
const search = '(?<search>(?:\\?[^#]*)?)'
const hash = '(?<hash>(?:#.*)?)';
const reg = new RegExp(`^${protocol}\/\/${host}${path}${search}${hash}`)

const execURL = url => {
  const result = reg.exec(url)
  if(result) {
    result.groups.port = result.groups.port || ''
    return result.groups
  }
  return {
    protocol: '',
    host: '',
    hostname: '',
    port: '',
    pathname: '',
    search: '',
    hash: '',
  }
}

const e = execURL('https://localhost:8080/?a=b#xxx')
console.log('%c 🍅 e: ', 'font-size:20px;background-color: #EA7E5C;color:#fff;', JSON.stringify(e));