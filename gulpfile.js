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
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');

var bundleOpts = {
    src: [],
    dest: 'public/javascripts'
}

/** Make sure files are placed in the right order. Some things depends on others.  */
bundleOpts.src = bundleOpts.src.concat(
    glob.sync('public/javascripts/react/*.js')
);

var opts = assign({}, watchify.args, {
    entries: bundleOpts.src,
    debug: true
});
var watchBundle = watchify(browserify(opts))
    .transform(babelify, {presets: ['es2015', 'react']})
    .on('update', watch)
    .on('log', gutil.log);

gulp.task('build', build);
gulp.task('browserify', build);
gulp.task('watch', watch);

/* Build: Used to deploy minified code for production use. */
function build() {
    var b = browserify({
        entries: bundleOpts.src,
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
        .pipe(gulp.dest(bundleOpts.dest))
}

/* Watch: Used to watch files for changes for development use. */
function watch() {
    return watchBundle.bundle()
        .on('error', gutil.log.bind(gutil, "Browserify Error"))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps:true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(bundleOpts.dest))
}

