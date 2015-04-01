var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var traceur = require('gulp-traceur');
var runSequence = require('run-sequence');

var PATHS = {
    src: {
        js: ['ng2/**/*.js'],
        html: 'ng2/**/*.html',
        css: 'ng2/**/*.css',
        shared: "shared/*.js"
    },
    dist: "dist/ng2",
    a2libs: [
        'node_modules/gulp-traceur/node_modules/traceur/bin/traceur-runtime.js',
        'node_modules/es6-module-loader/dist/es6-module-loader-sans-promises.src.js',
        'node_modules/systemjs/lib/extension-cjs.js',
        'node_modules/systemjs/lib/extension-register.js',
        'node_modules/angular2/node_modules/zone.js/zone.js',
        'node_modules/angular2/node_modules/zone.js/long-stack-trace-zone.js',
        'node_modules/angular2/node_modules/rx/dist/rx.all.js',
        'css/bootstrap.css',
        'css/bootstrap.css.map'
    ]
};

gulp.task('clean', function(done) {
    del([PATHS.dist], done);
});

gulp.task('js', function () {
    return gulp.src(PATHS.src.js)
        .pipe(rename({extname: ''})) //hack, see: https://github.com/sindresorhus/gulp-traceur/issues/54
        .pipe(plumber())
        .pipe(traceur({
            modules: 'instantiate',
            moduleName: true,
            annotations: true,
            types: true,
            memberVariables: true
        }))
        .pipe(rename({extname: '.js'})) //hack, see: https://github.com/sindresorhus/gulp-traceur/issues/54
        .pipe(gulp.dest(PATHS.dist));
});

gulp.task("ng1js", [], function() {
   return gulp.src(PATHS.src.js)
     .pipe(gulp.dest(PATHS.dist));
});

gulp.task('html', function () {
    return gulp.src(PATHS.src.html)
        .pipe(gulp.dest(PATHS.dist));
});
gulp.task('css', function () {
    return gulp.src(PATHS.src.css)
        .pipe(gulp.dest(PATHS.dist));
});

gulp.task('libs', ['angular2'], function () {
    return gulp.src(PATHS.a2libs)
        .pipe(gulp.dest(PATHS.dist+'/lib'));
});

gulp.task("shared", function() {
    return gulp.src(PATHS.src.shared)
        .pipe(gulp.dest(PATHS.dist+"/shared"));
})  

gulp.task('angular2', function () {

    //transpile & concat
    return gulp.src([
            'node_modules/angular2/es6/prod/*.es6',
            'node_modules/angular2/es6/prod/src/**/*.es6'],
        { base: 'node_modules/angular2/es6/prod' })
        .pipe(rename(function(path){
            path.dirname = 'angular2/' + path.dirname; //this is not ideal... but not sure how to change angular's file structure
            path.extname = ''; //hack, see: https://github.com/sindresorhus/gulp-traceur/issues/54
        }))
        .pipe(traceur({ modules: 'instantiate', moduleName: true}))
        .pipe(concat('angular2.js'))
        .pipe(gulp.dest(PATHS.dist+'/lib'));
});

gulp.task('play', ['ng2'], function () {

    var http = require('http');
    var connect = require('connect');
    var serveStatic = require('serve-static');
    var open = require('open');

    var port = 9000, app;

    gulp.watch(PATHS.src.html, ['html']);
    gulp.watch(PATHS.src.js, ['js']);
    gulp.watch(PATHS.src.css, ['css']);
    gulp.watch(PATHS.src.shared, ['shared']);

    app = connect().use(serveStatic(__dirname + '/dist'));  // serve everything that is static
    http.createServer(app).listen(port, function () {
        open('http://localhost:' + port+"/ng2");
    });
});

gulp.task("ng1watchers", ["shared"], function() {
    gulp.watch(PATHS.src.html, ['html']);
    gulp.watch(PATHS.src.js, ['ng1js']);
    gulp.watch(PATHS.src.css, ['css']);
    gulp.watch(PATHS.src.shared, ['shared']);
});

gulp.task("ng1play", ["ng1"], function() {
    var http = require('http');
    var connect = require('connect');
    var serveStatic = require('serve-static');
    var open = require('open');

    var port = 9001, app;

    app = connect().use(serveStatic(__dirname + '/dist'));  // serve everything that is static
    http.createServer(app).listen(port, function () {
        open('http://localhost:' + port+"/ng1");
    });
});

gulp.task("ng1paths", [], function() {
   PATHS.src =  {
       js: ['ng1/**/*.js'],
       html: 'ng1/**/*.html',
       css: 'ng1/**/*.css',
       shared: "shared/*.js"
   };
    PATHS.dist = "dist/ng1";
});

gulp.task("ng1", ["ng1paths"], function() {
    runSequence("clean", ['ng1js', 'html', 'css', "shared"], "ng1watchers");
});

gulp.task('ng2', ['js', 'html', 'libs', 'css', "shared"]);

gulp.task("default", [], function() {
    runSequence("play", "ng1play");
});