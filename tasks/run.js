const gulp = require("gulp"),
  connect = require('gulp-connect');

module.exports = {
  "webserver": function (done) {
    connect.server({
      root: 'packages/dist',
      port: 8000,
    })
  },
  "source-monitor": function (done) {
    gulp.watch(
      ["./packages/src/**/*.js"],
      gulp.series(["build:ax", "build:axf"])
    );
  },
};
