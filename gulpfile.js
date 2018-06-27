const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const less = require("gulp-less");
const path = require("path");
const inlinesource = require("gulp-inline-source");
var htmlmin = require("gulp-htmlmin");
const del = require("del");

gulp.task("minify", function() {
  return gulp
    .src("./out/concatenated/*.html")
    .pipe(
      htmlmin({ collapseWhitespace: true, minifyCSS: true, minifyJS: true })
    )
    .pipe(gulp.dest("./out"));
});

gulp.task("inlinesource", () => {
  const options = {
    compress: false
  };

  return gulp
    .src("./src/*.html")
    .pipe(inlinesource(options))
    .pipe(gulp.dest("./out/concatenated"));
});

gulp.task("cleanOut", function() {
  return del("out/**", { force: true });
});

gulp.task("build", gulp.series("cleanOut", "inlinesource", "minify"));

gulp.task("cleanSrc", function() {
  return del(["src/**", "!src"], { force: true });
});

gulp.task("copyBoilerplate", function() {
  return gulp.src("./boilerplate/**").pipe(gulp.dest("./src"));
});

gulp.task("newProject", gulp.series("cleanSrc", "copyBoilerplate"));

gulp.task("less", () =>
  gulp
    .src("./src/less/**/*.less")
    .pipe(
      less({
        paths: [path.join(__dirname, "less", "includes")]
      })
    )
    .pipe(gulp.dest("./src/css"))
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

gulp.task(
  "watch",
  gulp.series(gulp.parallel("browserSync", "less"), () => {
    browserSync.watch("src/**/**/*.*").on("change", browserSync.reload);
    gulp.watch("src/**/**/*.*", gulp.series("build"));
    gulp.watch("src/less/**/*.less", gulp.series("less"));
  })
);
