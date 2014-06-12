var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var fs = require('fs');

var browserify_tasks = [];
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
    browserify_tasks.push(task);
    gulp.task(task, function () {
        var b = browserify(entry);
        b.transform('coffeeify');
        b.transform('jadeify');
        return b
                .bundle()
                .pipe(source(dest))
                .pipe(gulp.dest(config.jsDir))
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


gulp.task('default', browserify_tasks)
