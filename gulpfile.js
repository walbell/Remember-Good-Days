'use strict';

var gulp = require('gulp'),
	jade = require('gulp-jade'),
	browserify = require('gulp-browserify'),
	stringify = require('stringify'),
	color = require('cli-color'),
	stylus = require('gulp-stylus'),
	dependants = require('dependants-parser');

/*
 * Initialise Tiny LiveReload and environment variables
 */

var env = process.env.NODE_ENV || 'development',
    production = env === 'production',
    buildMode = process.argv.indexOf('build') !== -1;

/*
 * Paths configuration
 */

var paths = {
	staticDir  : 'www',
    views      : { watch: [ 'templates/**/*.jade'], srcBase: 'templates/', src: 'templates/**/*.jade', out: 'www' },
    browserify : { watch: [ 'js/**/*.js', 'www/**/*.html' ], src: 'js/index.js', out: 'www/js', main: 'index.js' },
    styles     : { watch: [ 'styles/**/*.styl' ], src: 'styles/styles.styl', out: 'www/css' }
};

/*
 * Beep function for error handling
 */

function beep () {
    console.log('\007');
}

/*
 * Custom handler for compiling errors
 */

function handleError (error) {
    beep(error);
    console.log(color.bold('[ error caught ]:\n') + color.red(error));
}

/*
 * Bundle JavaScript with Browserify
 */

gulp.task('browserify', function () {
    var stream = gulp
    .src(paths.browserify.src, { read: false })
    .pipe(browserify({
        transform: stringify([ '.html' ])
    }));

    stream
    .on('error', handleError)
    .pipe(gulp.dest(paths.browserify.out));
});

/*
 * Compile Stylus into CSS
 */

gulp.task('styles', function () {
    gulp
    .src(paths.styles.src)
    .pipe(stylus())
    .on('error', handleError)
    .pipe(gulp.dest(paths.styles.out));
});

/*
 * Compile Jade views into HTML
 */

gulp.task('views', function (next) {
    var dep = [],
        changedFiles = [];

    var stream = gulp
    .src(paths.views.src)
    .on('data', function (change) {
        if (!change.history) {
            changedFiles = [];
            return;
        }

        var file = change.history[0];

        dep = dependants.findSync(file, 'views', dependants.patterns.jade);
        changedFiles = dep;
    })
    .pipe(jade())
    .on('error', function (err) {
        handleError(err);
        next();
    });

    if (!buildMode && !production) {
        stream = stream.pipe(changed(paths.views.out, {
            hasChanged: function (stream, callback, sourceFile) {
                for(var i = 0; i < arguments.length; i ++) {
                    if (changedFiles.indexOf(sourceFile.history[0]) !== -1) {
                        return callback(null, true);
                    }
                }

                return changed.compareLastModifiedTime.apply(this, arguments);
            }
        }));
    }

    stream = stream
    .pipe(gulp.dest(paths.views.out))
    .on('end', next);
});


gulp.task('default', function() {
  // place code for your default task here
});
