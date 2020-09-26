var makeGood = function(s) {
  let pre
  while (pre !== s) {
    pre = s
    s = s.replace(/[A-Z][a-z]|[a-z][A-Z]/, '')
  }
  return s
};

makeGood("leEeetcode")