var readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.on('line', function (line) {
  var tokens = line.split(' ').map(function (x) { return parseInt(x); });
  console.log(tokens.reduce(function (a, b) { return a + b; }));
});