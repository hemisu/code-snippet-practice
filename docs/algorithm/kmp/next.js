const str = 'GTGTGCF'

//i 0123456
// 'GTGTGCF'
//  0012300
// i = 5, len = 3 len = next[2] = 1,
//        len = next[1] = 0, ,i = 6
// i = 4的时候，len = 2 时对上然后让len++, 到5要让len回退到next[len - 1] ??????
//        
const next = new Array(str.length).fill(0);
  // 抽出来，方便学习记忆，是固定的模板代码
  const kmp = (next, str) => {
    next[0] = 0;
    let len = 0; // 最长公共前缀字串长度
    let i = 1;
    while (i < str.length) {
      if (str[i] == str[len]) {
        len++; 
        next[i] = len;
        i++;
      } else {
        if (len == 0) {
          next[i] = 0;
          i++;
        } else { // 回溯，退化到
          len = next[len - 1];
        }
      }
    }
  };
  kmp(next, str);

