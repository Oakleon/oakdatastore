"use strict";

var gulp   = require('gulp');
var babel  = require('gulp-babel');

gulp.task('default', ['buildsrc']);

gulp.task('buildsrc', function() {
    return gulp.src('src/**/*.js')
       .pipe(babel({    plugins: ['syntax-async-functions', 'transform-runtime'],
                        presets: ['es2015-node4', 'stage-3']
                    }))
       .pipe(gulp.dest('build'));
});
