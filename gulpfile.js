"use strict";

var gulp = require('gulp');
var glob = require('glob');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');

var bundleOpts = {
    jsSrc: [],
    jsDest: 'public/javascripts'
}

/** Make sure files are placed in the right order. Some things depends on others.  */
bundleOpts.jsSrc = bundleOpts.jsSrc.concat(
    glob.sync('public/javascripts/react/*.js')
);

var opts = assign({}, watchify.args, {
    entries: bundleOpts.jsSrc,
    debug: true
});
var watchBundle = watchify(browserify(opts))
    .transform(babelify, {presets: ['es2015', 'react']})
    .on('update', watch)
    .on('log', gutil.log);

gulp.task('build', build);
gulp.task('browserify', build);
gulp.task('watch', watch);

gulp.task('sass', buildSass);

function buildSass() {
    gulp.src('public/stylesheets/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('public/stylesheets/'))
}

/* Build: Used to deploy minified code for production use. */
function build() {
    var b = browserify({
        entries: bundleOpts.jsSrc,
        debug: false
    });

    return b.transform(babelify, {presets: ['es2015', 'react']})
        .bundle()
        .on('error', gutil.log.bind(gutil, "Browserify Error"))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(sourcemaps.init({loadMaps:true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(bundleOpts.jsDest))
}

/* Watch: Used to watch files for changes for development use. */
function watch() {
    buildSass();
    gulp.watch('public/stylesheets/**/*.scss', ['sass']);
    return watchBundle.bundle()
        .on('error', gutil.log.bind(gutil, "Browserify Error"))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps:true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(bundleOpts.jsDest))
}

