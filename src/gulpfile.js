const { src, dest, parallel, watch } = require('gulp')
const autoprefixer = require('gulp-autoprefixer')
const cssmin = require('gulp-cssmin')
const less = require('gulp-less')
const terser = require('gulp-terser')

function scripts () {
  return src('scripts/*.js')
    .pipe(terser())
    .pipe(dest('../static/js'))
}

function styles () {
  return src('styles/*.less')
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(dest('../static/css'))
}

function watchTask () {
  return watch('styles/*.less', styles)
}

exports.build = parallel(scripts, styles)
exports.watch = watchTask
