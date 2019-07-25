'use strict';
require('babel-polyfill')
const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');

// var uglify = require('gulp-uglify');
// var concat = require('gulp-concat');
var babel = require("gulp-babel");

gulp.task('concat-file', function () {
    process.exit();
    gulp.src([
        'src/**/*.ts',
        'src/**/*.tsx'
    ])
        .pipe(babel())

        .pipe(babel({
            plugins: ['transform-runtime']        // babel-plugin-transform-runtime 在这里使用;
         }))
        // .pipe(uglify())
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
});
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

build.initialize(gulp);
