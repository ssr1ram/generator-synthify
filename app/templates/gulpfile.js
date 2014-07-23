var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var watch = require('gulp-watch');
var source = require('vinyl-source-stream');
var fs = require('fs');

var default_tasks = [];
var dev_tasks = [];
var resourceStack = [];

config = {
    "pagesDir": "./pages",
    "jsDir": "./public/js",
    "cssDir": "./public/css"
}

function browserify_task(page) {
    var entry = page.entry;
    var dest = page.dest;
    var task = page.entry
    default_tasks.push("b_" + task);
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
    dev_tasks.push("w_" + task);
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
function less_task(page) {
    var task = page.entry
    default_tasks.push(task);
    gulp.task(task, function () {
        gulp.src(page.entry)
          .pipe(less())
          .pipe(rename(page.dest))
          .pipe(gulp.dest(config.cssDir))
        gulp.src(page.entry)
          .pipe(less({compress: true}))
          .pipe(rename(page.dest.replace('.css', '.min.css')))
          .pipe(gulp.dest(config.cssDir))
    });
    dev_tasks.push("w_" + task);
    gulp.task("w_" + task, function () {
        gulp.src(page.entry)
          .pipe(watch())
          .pipe(less())
          .pipe(rename(page.dest))
          .pipe(gulp.dest(config.cssDir))
    });
}

function getPublicDestDir(rootDir, dir) {
    var destdir = dir.replace(rootDir, '').replace(/^\//, '');
    if (destdir) {
        destdir = destdir + "/";
    } else {
        destdir = "";
    }
    return destdir
}

(function parseFront (dir) {
  var contents = fs.readdirSync(dir).sort();
  contents.forEach(function (file) {
    if ( /_front\.(js|coffee)$/.test(file) ) {
        var destdir = getPublicDestDir(config.pagesDir, dir);
        var page = {"entry": dir + "/" + file, "dest": destdir + file.replace("_front", "").replace('coffee', 'js')};
        browserify_task(page)
    } else if ( /.(less|css)$/.test(file) ) {
        var destdir = getPublicDestDir(config.pagesDir, dir);
        var page = {"entry": dir + "/" + file, "dest": destdir + file.replace('less', 'css')};
        less_task(page)
    } else {
        if (fs.statSync(dir + "/" + file).isDirectory()) {
            resourceStack.push(file);
            parseFront(dir + '/' + file);
            resourceStack.pop();
        }
    }
  });
})(config.pagesDir);

gulp.task('dev', dev_tasks)
gulp.task('default', default_tasks)
