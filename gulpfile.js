const requireDir = require("require-dir"),
  tasks = requireDir("./tasks"),
  gulp = require("gulp"),
  exec = require('child_process').exec;

gulp.task("build:pretty-source", tasks.build["pretty-source"]);
gulp.task("build:ax", tasks.build["ax"]);
gulp.task("build:axf", tasks.build["axf"]);
gulp.task("build:axf-concat", tasks.build["axf-concat"]);
gulp.task("build:axf-template", tasks.build["axf-template"]);
gulp.task("publish:ax", tasks.publish["ax"]);
gulp.task("publish:axf", tasks.publish["axf"]);
gulp.task("run:source-monitor", tasks.run["source-monitor"]);
gulp.task("run:webserver", tasks.run["webserver"]);

gulp.task(
  "build",
  gulp.series([
    "build:pretty-source",
    "build:ax",
    "build:axf",
  ])
);

gulp.task(
  "publish",
  gulp.series([
    "build",
    "publish:ax",
    "publish:axf",
  ])
)

gulp.task(
  "default",
  gulp.series([
    "build:ax",
    "build:axf",
    gulp.parallel([
      "run:source-monitor",
      "run:webserver",
    ]),
  ])
);
