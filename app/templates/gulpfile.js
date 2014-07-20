var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var fs = require('fs');

var browserify_tasks = [];
var watchify_tasks = [];
var resourceStack = [];

config = {
    "pagesDir": "./pages",
    "jsDir": "./public/js"
}

function browserify_task(page) {
    console.log(page);
    var entry = page.entry;
    var dest = page.dest;
    var task = page.entry
    browserify_tasks.push("b_" + task);
    gulp.task("b_" + task, function () {
        var b = browserify(entry);
        b.transform('coffeeify');
        b.transform('jadeify');
        bundle = function() {
            b
            .bundle()
            .pipe(source(dest))
            .pipe(gulp.dest(config.jsDir))
            .pipe(streamify(uglify()))
            .pipe(rename(dest.replace('.js', '.min.js')))
            .pipe(gulp.dest(config.jsDir))

        }
        return bundle()
    })
    watchify_tasks.push("w_" + task);
    gulp.task("w_" + task, function () {
        var b = watchify(entry);
        b.transform('coffeeify');
        b.transform('jadeify');
        bundle = function() {
            console.log('watchifying: ' + task);
            b
            .bundle()
            .pipe(source(dest))
            .pipe(gulp.dest(config.jsDir))
        }
        b.on('update', bundle)
        return bundle()
    })
}

(function parseDir (dir) {
  var contents = fs.readdirSync(dir).sort();
  contents.forEach(function (file) {
    if ( /_front\.(js|coffee)$/.test(file) ) {
        var page = {"entry": dir + "/" + file, "dest": file.replace("_front", "").replace('coffee', 'js')};
        browserify_task(page)
    } else {
        if (fs.statSync(dir + "/" + file).isDirectory()) {
            resourceStack.push(file);
            parseDir(dir + '/' + file);
            resourceStack.pop();
        }
    }
  });
})(config.pagesDir);


gulp.task('dev', watchify_tasks)
gulp.task('default', browserify_tasks)
