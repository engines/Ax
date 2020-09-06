// const gulp = require("gulp"),
//   fs = require("fs"),
//   path = require("path"),
//   sort = require("gulp-sort"),
//   concat = require("gulp-concat"),
//   rename = require("gulp-rename"),
//   tap = require('gulp-tap'),
//   mustache = require("gulp-mustache"),
//   prettier = require('gulp-prettier'),
//   lib = require("./lib.js");
//
// const axConcat = (package) => {
//   gulp
//   .src(`./packages/src/${package}/**/*.js`)
//   .pipe(sort(lib.fileOrder))
//   .pipe(concat(`${package}.js`))
//   .pipe(gulp.dest(`./packages/dist/@engines/${package}/lib`));
// };
//
// const axTemplate = (package) => {
//   gulp
//   .src(`./packages/modules/templates/${ package == 'ax' ? 'ax' : 'axExtension'}.mustache`)
//   .pipe(mustache({
//     js: fs.readFileSync(`./packages/dist/@engines/${package}/lib/${package}.js`, "utf8")
//   }))
//   .pipe(rename(`${package}.js`))
//   .pipe(gulp.dest(`./packages/dist/@engines/${package}/lib`));
// };
//
// const axBuild = (id, config) => {
//   let packageConfig = config.packages[id];
//   let name = packageConfig.name;
//   console.log(`Build: ${name}`);
//
//   axConcat(id);
//   axTemplate(id);
// }
//
// module.exports = {
//   "ax": function (done) {
//     let config = require('../packages/modules/npm.json');
//     let packages = Object.keys(config.packages);
//     for (let package of packages) {
//       axBuild(package, config)
//     };
//     done();
//   },
//   "pretty-source": function (done) {
//     return gulp
//       .src("./packages/src/**/*.js")
//       .pipe(prettier({ singleQuote: true }))
//       .pipe(gulp.dest("./packages/src/"));
//   },
//   "axf": function (done) {
//     return gulp.series(
//       "build:axf-concat",
//       "build:axf-template")(done);
//   },
//   "axf-concat": function (done) {
//     return gulp
//       .src("./packages/src/**/*.js")
//       .pipe(sort(lib.fileOrder))
//       .pipe(concat("axf.js"))
//       .pipe(gulp.dest("./packages/dist/axf/"));
//   },
//   "axf-template": function (done) {
//     return gulp
//       .src(`./packages/modules/templates/axf.mustache`)
//       .pipe(mustache({
//         js: fs.readFileSync(`./packages/dist/axf/axf.js`, "utf8")
//       }))
//       .pipe(rename(`axf.js`))
//       .pipe(gulp.dest(`./packages/dist/axf/`));
//   },
//
// };
