var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('default', function () {
    return gulp
        .src('./app_src/**/*.js')
        .pipe(babel({
            presets: ['es2015'],
            plugins: ["transform-es2015-modules-amd"]
        }))
        .pipe(gulp.dest('./app/'));
});