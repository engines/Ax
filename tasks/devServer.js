const gulp = require("gulp"),
  connect = require("gulp-connect");

module.exports = {
  webserver: function (done) {
    connect.server({
      root: "packages/dist",
      port: 8000,
      host: "0.0.0.0",
    });
    done();
  },
  "source-monitor": function (done) {
    gulp.watch(
      ["./packages/src/**/*.js"],
      gulp.parallel(["buildAx"])
    );
    done();
  },
};