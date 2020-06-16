const gulp = require("gulp"),
  webserver = require("gulp-webserver");

module.exports = {
  "webserver": function (done) {
    return gulp.src("packages/dist").pipe(webserver());
  },
  "source-monitor": function (done) {
    return gulp.watch(
      ["./packages/src/**/*.js"],
      gulp.series(["build:ax", "build:axf"])
    );
  },
};
