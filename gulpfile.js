'use strict';

const gulp = require('gulp');
const terser = require('gulp-terser');
const sass = require('gulp-sass');

gulp.task('default', (done) => {
  console.log('GULP TASKS');
  console.log('terser : Minify JavaScript files');
  console.log('scss : Precompile scss into css');
  done();
});

gulp.task('terser', (done) => {
  gulp.src('./javascript/*.js')
    .pipe(terser())
    .pipe(gulp.dest('./public/js'));
  done();
});

sass.compiler = require('node-sass');
gulp.task('scss', (done) => {
  gulp.src('./scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('scss:watch', (done) => {
  gulp.watch('./scss/**/*.scss', ['scss']);
  done();
});
