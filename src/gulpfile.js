const { src, dest, parallel } = require('gulp')
const cssmin = require('gulp-cssmin')
const less = require('gulp-less')
const rename = require('gulp-rename')
const terser = require('gulp-terser')

function scripts () {
  return src('scripts/*.js')
    .pipe(terser())
    .pipe(dest('../static/js'))
}

function styles () {
  return src('styles/main.less')
    .pipe(less())
    .pipe(cssmin())
    .pipe(rename('style.css'))
    .pipe(dest('../static/css'))
}

exports.build = parallel(scripts, styles)
