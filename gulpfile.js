'use strict';

const path = require('path');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

const pathPublic = './public';
const pathJavaScript = './javascript';
const pathScss = './scss';
const pathData = './data';
const pathImages = './images';

gulp.task('default', (done) => {
  console.log('GULP TASKS');
  console.log('compile : Minifies JavaScript files and compiles/minifies SCSS into CSS');
  console.log('debug : Copies over JavaScript files and compiles SCSS into CSS');
  done();
});

gulp.task('copy-javascript', (done) => {
  gulp.src(path.join(pathJavaScript, '*.js'))
    .pipe(gulp.dest(path.join(pathPublic, 'js')));
  done();
});

gulp.task('minify-javascript', (done) => {
  gulp.src(path.join(pathJavaScript, '*.js'))
    .pipe(terser())
    .pipe(gulp.dest(path.join(pathPublic, 'js')));
  done();
});

sass.compiler = require('node-sass');
gulp.task('compile-scss', (done) => {
  gulp.src(path.join(pathScss, '**/*.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(path.join(pathPublic, 'css')));
  done();
});

gulp.task('minify-css', gulp.series('compile-scss', (done) => {
  const plugins = [
    autoprefixer({ browsers: ['last 1 version'] }),
    cssnano
  ];
  gulp.src(path.join(pathScss, '**/*.scss'))
    .pipe(sourcemaps.init())
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.join(pathPublic, 'css')));
  done();
}));

gulp.task('copy-data', (done) => {
  gulp.src(path.join(pathData, '*.csv'))
    .pipe(gulp.dest(path.join(pathPublic, 'data')));
  done();
});

gulp.task('copy-favicon', (done) => {
  gulp.src(path.join(pathImages, 'favicon.ico'))
    .pipe(gulp.dest(path.join(pathPublic, 'img')));
  done();
});

gulp.task('compile', gulp.series('minify-javascript', 'minify-css', 'copy-data', 'copy-favicon'), (done) => { done(); });
gulp.task('debug', gulp.series('copy-javascript', 'compile-scss', 'copy-data', 'copy-favicon'), (done) => { done(); });
