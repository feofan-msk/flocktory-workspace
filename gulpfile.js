const gulp = require("gulp");
const path = require("path");
const browserSync = require("browser-sync").create();
const less = require("gulp-less");
const inlinesource = require("gulp-inline-source");
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const babel = require("gulp-babel");
const plumber = require("gulp-plumber");

gulp.task("minify", () =>
  gulp
    .src("./out/*.html")
    .pipe(
      htmlmin({ collapseWhitespace: true, minifyCSS: true, minifyJS: true })
    )
    .pipe(gulp.dest("./out"))
);

gulp.task("inlinesource", () => {
  const options = {
    compress: false
  };

  return gulp
    .src("./src/*.html")
    .pipe(inlinesource(options))
    .pipe(gulp.dest("./out"));
});

gulp.task("cleanOut", () => del("out/**", { force: true }));

gulp.task("build", gulp.series("cleanOut", "inlinesource"));

gulp.task("cleanSrc", () => del(["src/**", "!src"], { force: true }));

gulp.task("copyBoilerplate", () =>
  gulp.src("./boilerplate/**").pipe(gulp.dest("./src"))
);

gulp.task("newProject", gulp.series("cleanSrc", "cleanOut", "copyBoilerplate"));

gulp.task("less", () =>
  gulp
    .src("./src/less/**/*.less")
    .pipe(plumber())
    .pipe(
      less({
        paths: [path.join(__dirname, "less", "includes")]
      })
    )
    .pipe(gulp.dest("./src"))
    .pipe(browserSync.stream())
);

gulp.task("browserSync", callback => {
  browserSync.init({
    server: {
      baseDir: "src"
    }
  });
  callback();
});

gulp.task("transpile", () =>
  gulp
    .src("src/js/index.js")
    .pipe(plumber())
    .pipe(
      babel({
        presets: ["env"]
      })
    )
    .pipe(gulp.dest("src"))
);

// launch a server with hot reload
gulp.task(
  "start",
  gulp.series(
    gulp.series(gulp.parallel("less", "transpile"), "browserSync"),
    done => {
      browserSync
        .watch(["src", "!src/less", "!src/js"])
        .on("change", browserSync.reload);

      // looks for changes
      gulp.watch("src/less", gulp.series("less"));
      gulp.watch("src/js", gulp.series("transpile"));
      done();
    }
  )
);

gulp.task(
  "watch",
  gulp.series(done => {
    gulp.watch(["src", "!src/less", "!src/js"], gulp.series("build"));
    done();
  })
);

gulp.task("default", gulp.series("start", "watch"));
