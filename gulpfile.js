import gulp from 'gulp';
import shell from 'gulp-shell';//可以直接运行终端命令

const clearFn = shell.task('rm -rf dist/');
const packCommand = `node \
  -r babel-register \
  ./node_modules/webpack/bin/webpack \
    --display minimal \
    --progress \
    --config ./config/webpack.config.js \
`;

gulp.task('clear', clearFn);

gulp.task('pack', ['clear'], shell.task(packCommand));

gulp.task('default', ['pack']);

// gulp.task('default', ['task1', 'task2'], function () {
//   // 将你的默认的任务代码放在这
//   console.log("default1");
// });

// gulp.task('task1', shell.task('mkdir aaa'));
// gulp.task('task2', function () {
//   console.log("task22");
// })
