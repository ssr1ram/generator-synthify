var gulp = require('gulp');
var browserify = require('browserify');
var source       = require('vinyl-source-stream');

gulp.task('browserify', function() {
    var b = browserify('./pages/foo/foo.coffee');
    b.transform('coffeeify');
    b.transform('jadeify');
    return b
            .bundle()
            .pipe(source('foo.js'))
            .pipe(gulp.dest('./public/js'));

});


