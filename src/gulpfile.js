const fs = require('fs')
const { src, dest, parallel, watch } = require('gulp')
const autoprefixer = require('gulp-autoprefixer')
const cssmin = require('gulp-cssmin')
const less = require('gulp-less')
const terser = require('gulp-terser')

const wasmFolder = '../static/wasm'

const srcMap = {
  scripts: 'scripts/*.js',
  styles: 'styles/*.less',
  wasm: wasmFolder + '/*.wasm'
}

const destMap = {
  scripts: '../static',
  styles: '../static/css'
}

function buildScripts () {
  return src(srcMap.scripts)
    .pipe(terser())
    .pipe(dest(destMap.scripts))
}

function buildScriptsDev () {
  return src(srcMap.scripts)
    .pipe(dest(destMap.scripts))
}

function buildStyles () {
  return src(srcMap.styles)
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(dest(destMap.styles))
}

function buildStylesDev () {
  return src(srcMap.styles)
    .pipe(less())
    .pipe(dest(destMap.styles))
}

function buildWASM (cb) {
  const files = fs.readdirSync(wasmFolder)
  fs.writeFileSync(destMap.scripts + '/wasm-list.js', 'var cacheFiles=' + JSON.stringify(files.map(file => '/wasm/' + file)))
  cb()
}

function watchTask () {
  watch(srcMap.scripts, buildScripts)
  watch(srcMap.styles, buildStyles)
  watch(srcMap.wasm, buildWASM)
}

exports.build = parallel(buildScripts, buildStyles, buildWASM)
exports.buildDev = parallel(buildScriptsDev, buildStylesDev, buildWASM)
exports.watch = watchTask
