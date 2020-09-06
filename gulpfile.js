const devServer = require("./tasks/devServer.js"),
  gulp = require("gulp"),
  prompt = require("prompt"),
  concat = require("gulp-concat"),
  exec = require("child_process").exec,
  prettier = require("gulp-prettier"),
  sort = require("gulp-sort"),
  mustache = require("gulp-mustache"),
  rename = require("gulp-rename"),
  fs = require("fs"),
  lib = require("./tasks/lib.js"),
  config = require("./packages/modules/npm.json"),
  packages = Object.keys(config.packages["@engines"]);

gulp.task("dev:source-monitor", devServer["source-monitor"]);
gulp.task("dev:webserver", devServer["webserver"]);

gulp.task("publish", function (done) {
  gulp.series(["setVersion", "prettySource", "buildAx", "publishAx"])(done);
});

gulp.task("setVersion", function (done) {
  exec(`npm view @engines/ax version`, function (err, stdout, stderr) {
    let version = stdout.trim();
    let match = version.match(/(\d+)\.(\d+)\.(\d+)/);
    global.bump = `${match[1]}.${match[2]}.${Number(match[3]) + 1}`;
    console.log(`Latest published version: ${version}`);
    prompt.get(
      {
        name: "version",
        description: "Version to publish",
        default: global.bump,
      },
      function (err, result) {
        global.pubversion = result.version;
        done();
      }
    );
  });
});

gulp.task("prettySource", function (done) {
  return gulp
    .src("./packages/src/**/*.js")
    .pipe(prettier({ singleQuote: true }))
    .pipe(gulp.dest("./packages/src/"));
});

gulp.task("publishAx", function (done) {
  for (let package of packages) {
    exec(
      `npm publish ${__dirname}/packages/dist/@engines/${package}/ --access public`,
      function(err, stdout, stderr) {
        console.log(stderr)
      }
    );
  }
  done();
});

gulp.task("buildAx", function (done) {
  let tasks = [];
  for (let package of packages) {
    let packageConfig = config.packages["@engines"][package];
    tasks.push(
      axConcat(package),
      axTemplate(package),
      axNpmPackage(package, packageConfig),
    );
  }
  gulp.series(tasks)(done);
});

const axConcat = (package) => (done) => {
  return gulp
    .src(`./packages/src/${package}/**/*.js`)
    .pipe(sort(lib.fileDepthSort))
    .pipe(concat(`${package}.js`))
    .pipe(gulp.dest(`./packages/dist/@engines/${package}`));
};

const axTemplate = (package) => (done) => {
  return gulp
    .src(
      `./packages/modules/templates/${
        package == "ax" ? "ax" : "axExtension"
      }.mustache`
    )
    .pipe(
      mustache({
        js: fs.readFileSync(
          `./packages/dist/@engines/${package}/${package}.js`,
          "utf8"
        ),
      })
    )
    .pipe(rename(`${package}.js`))
    .pipe(gulp.dest(`./packages/dist/@engines/${package}`));
};

const axNpmPackage = (name, packageConfig) => (done) => {
  let package = {
    name: `@engines/${name}`,
    version: global.pubversion,
    description: packageConfig.description,
    main: `${name}.js`,
    repository: config.repository,
    author: config.author,
    license: config.license,
    bugs: config.bugs,
    homepage: packageConfig.homepage,
  };
  let packageJSON = JSON.stringify(package, null, 2);
  console.log(packageJSON);
  fs.writeFileSync(`./packages/dist/@engines/${name}/package.json`, packageJSON);
  done();
};

const axIndex = (id, name) => (done) => {
  return gulp
    .src(`./packages/modules/indexes/${id}.js`)
    .pipe(concat("index.js"))
    .pipe(gulp.dest(`./packages/dist/${name}/`));
};

gulp.task(
  "default",
  gulp.series([
    "buildAx",
    gulp.parallel(["dev:source-monitor", "dev:webserver"]),
  ])
);
