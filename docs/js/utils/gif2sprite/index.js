const extractFrames = require('gif2sprite');
const fs = require('fs');
 
const arg = (argList => {
  let arg = {}, a, opt, thisOpt, curOpt;
  for (a = 0; a < argList.length; a++) {
    thisOpt = argList[a].trim();
    opt = thisOpt.replace(/^\-+/, '');

    if (opt === thisOpt) {
      // argument value
      if (curOpt) arg[curOpt] = opt;
      curOpt = null;
    }
    else {
      // argument name
      curOpt = opt;
      arg[curOpt] = true;

    }
  }
  return arg;

})(process.argv);

async function extract() {
  console.log('转换开始', arg);
  const {
    src,
  } = arg
  if(!src) {
    console.error('请增加 -src 参数指定需要转换的 gif')
  }
  try {
    const buffer = fs.readFileSync(src);
    const results = await extractFrames({
      input: buffer,
      type: 'image/gif', // type is required if input is buffer
      output: 'output.png', // will be buffer if no output
      merge: true, // gif can merge into one sprite
      callback: () => {
        console.log('转换完成!')
      }
    });
  } catch (e) {
    console.warn(e)
  }
 
}
extract();
 