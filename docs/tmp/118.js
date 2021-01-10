var generate = function(numRows) {
  return Array(numRows).fill()
    .map((_, i, r) => r[i] = Array(i + 1)
      .fill(1)
      .map((v, j) => j > 0 && j < i 
        ? r[i - 1][j - 1] + r[i - 1][j] 
        : v)
    )
};

const res = generate(5)
console.log('%c 🍹 res: ', 'font-size:20px;background-color: #4b4b4b;color:#fff;', res);