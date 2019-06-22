gulp = require 'gulp'
argv = require('yargs').argv
coffeelint = require 'gulp-coffeelint'
mocha = require 'gulp-spawn-mocha'
eslint = require 'gulp-eslint'

###*
 * Task for linting .coffee, .cjsxm .js and jsx files.
 * @example
 * gulp lint
 * // lints all .cjsx, .coffee, .js and .jsx files including this (gulpfile.coffee) file itself
 * @example
 * gulp lint -f app/main.coffee
 * gulp lint --file app/main.coffee
 * // lints 'main.coffee' file in 'app' folder
 * gulp lint -f app/main.js
 * gulp lint --file app/main.js
 * // lints 'main.js' file in 'app' folder
###
gulp.task 'lint', ->
  arg = argv.file or argv.f

  ###*
   * Detects the type of the file that was passed as parameter.
   * If no file parameter was passed - remains undefined.
   * If file parameter contains '.coffee' or '.cjsx' substring -
   * file type is considered to be coffee,
   * if it contains '.js' substring - then js
   * @type {string|undefined}
  ###
  fileType = arg and ((/\.coffee|\.cjsx/i.test(arg) and 'coffee') or (/\.js/i.test(arg) and 'js'))

  lintCoffee = (file) ->
    path = file or [
      'gulpfile.coffee'
      'elements/**/*.coffee'
      'elements/**/*.cjsx'
    ]

    gulp.src(path)
      .pipe(coffeelint('coffeelint.json'))
      .pipe(coffeelint.reporter())
      .pipe(coffeelint.reporter('fail'))

  lintJS = (file) ->
    path = file or [
      'main.js'
      'elements/**/*.js'
      'elements/**/*.jsx'
      'tests/**/*.js'
      'tests/**/*.jsx'
    ]
    gulp.src(path)
      .pipe eslint()
      .pipe eslint.format()
      .pipe eslint.failAfterError()

  switch fileType
    when 'coffee' then lintCoffee arg
    when 'js' then lintJS arg
    else
      lintCoffee arg
      lintJS arg

gulp.task 'test', ['lint'], ->
  gulp.src('tests/**/*.cjsx')
  .pipe(mocha({
    compilers: "cjsx:coffee-react/register"
    require: "tests/setup.coffee"
  }))
