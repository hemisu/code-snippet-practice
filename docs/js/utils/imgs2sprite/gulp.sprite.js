/**
 * 多张图变成sprite图+css文件
 * gulp -f gulp.sprite.js --src ./src --dist ./dist
 */                                                                        
var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');

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


gulp.task('default', function () {
  console.log(arg)
  const {
    src = './src/**/*.png',
    dist = './dist/'
  } = arg
  var spriteData = gulp.src(src).pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css',
    algorithm: 'top-down'
  }));
  return spriteData.pipe(gulp.dest(dist));
});