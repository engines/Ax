const gulp = require("gulp"),
  fs = require("fs"),
  path = require("path"),
  sort = require("gulp-sort"),
  concat = require("gulp-concat"),
  rename = require("gulp-rename"),
  tap = require('gulp-tap'),
  mustache = require("gulp-mustache"),
  prettier = require('gulp-prettier'),
  lib = require("./lib.js");

const axConcat = (package) => (done) => {
  return gulp
  .src(`./packages/src/${package}/**/*.js`)
  .pipe(sort(lib.fileOrder))
  .pipe(concat(`${package}.js`))
  .pipe(gulp.dest(`./packages/dist/@engines/${package}/lib`));
};

const axTemplate = (package) => (done) => {
  return gulp
  .src(`./tasks/templates/${ package == 'ax' ? 'ax' : 'axExtension'}.mustache`)
  .pipe(mustache({
    js: fs.readFileSync(`./packages/dist/@engines/${package}/lib/${package}.js`, "utf8")
  }))
  .pipe(rename(`${package}.js`))
  .pipe(gulp.dest(`./packages/dist/@engines/${package}/lib`));
};

const axBuild = (package) => (done) => {
  return gulp.series(
    axConcat(package),
    axTemplate(package),
  )(done);
}

module.exports = {
  "ax": function (done) {
    return gulp.series(
      axBuild('ax'),
      axBuild('ax-appkit'),
      axBuild('ax-chartjs'),
      axBuild('ax-markedjs'),
      axBuild('ax-xtermjs'),
    )(done);
  },
  "pretty-source": function (done) {
    return gulp
      .src("./packages/src/**/*.js")
      .pipe(prettier({ singleQuote: true }))
      .pipe(gulp.dest("./packages/src/"));
  },
  "axf": function (done) {
    return gulp.series(
      "build:axf-concat",
      "build:axf-template")(done);
  },
  "axf-concat": function (done) {
    return gulp
      .src("./packages/src/**/*.js")
      .pipe(sort(lib.fileOrder))
      .pipe(concat("axf.js"))
      .pipe(gulp.dest("./packages/dist/axf/"));
  },
  "axf-template": function (done) {
    return gulp
      .src(`./tasks/templates/axf.mustache`)
      .pipe(mustache({
        js: fs.readFileSync(`./packages/dist/axf/axf.js`, "utf8")
      }))
      .pipe(rename(`axf.js`))
      .pipe(gulp.dest(`./packages/dist/axf/`));
  },

};
