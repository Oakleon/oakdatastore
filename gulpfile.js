"use strict";

var gulp   = require('gulp');
var babel  = require('gulp-babel');

gulp.task('default', ['buildsrc']);

gulp.task('buildsrc', function() {
    return gulp.src('src/**/*.js')
       .pipe(babel({ optional: ['runtime'] }))
       .pipe(gulp.dest('build'));
});
