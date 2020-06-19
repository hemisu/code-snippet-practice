const { asyncPoolES6, asyncPoolES7, asyncPoolSelf } = require('./asyncpool')

const timeout = i => new Promise(resolve => setTimeout(() => {
  console.log(`Call iterator (i = ${i})`)
  resolve(i)
}, i));
async function main() {
  await asyncPoolSelf(2, [1000, 5000, 3000, 2000], timeout);
}
main()