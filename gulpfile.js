"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var cssmin = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var uglify = require("gulp-uglify");
var htmlmin = require("gulp-htmlmin");
var run = require("run-sequence");
var del = require("del");

//config build

gulp.task("build", function (done) {
  run("clean", "style", "images", "scripts", "minify", "copy", done)
});

//end config build

//config style (+ css min)

gulp.task("style", function () {
  gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(cssmin())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))

    .pipe(server.stream());
});

//end config style (+ css min)

//config image min

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

//end config image min

//config js min

gulp.task("scripts", function () {
  return gulp.src("source/js/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("build/js"))
});

//end config js min

//config html min

gulp.task("minify", function () {
  return gulp.src("source/*.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"))
});

//end config html min

gulp.task("serve", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("source/*.html", ["html"]);
});

//copy in build

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**/*.webp"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

//end copy in build

//config del

gulp.task("clean", function () {
  return del("build");
});

//end config del
