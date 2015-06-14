var gulp = require('gulp'),
	jade = require('gulp-jade'),
	browserify = require('gulp-browserify'),
	stringify = require('stringify'),
	color = require('cli-color'),
	stylus = require('gulp-stylus'),
	dependants = require('dependants-parser'),
    changed = require('gulp-changed'),
    runSequence = require('run-sequence'),
    lr = require('tiny-lr');
/*
 * Initialise Tiny LiveReload and environment variables
 */

var server = lr(),
    env = process.env.NODE_ENV || 'development',
    production = env === 'production',
    buildMode = process.argv.indexOf('build') !== -1;

/*
 * Paths configuration
 */

var paths = {
	staticDir  : 'www',
    views      : { watch: [ 'templates/**/*.jade'], srcBase: 'templates/', src: 'templates/**/*.jade', out: 'www/templates' },
    browserify : { watch: [ 'js/**/*.js', 'www/**/*.html' ], src: 'js/index.js', out: 'www/js', main: 'index.js' },
    styles     : { watch: [ 'styles/**/*.styl' ], src: 'styles/main.styl', out: 'www/css' }
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
    var stream = gulp
    .src(paths.views.src)
    .on('data', function (change) {
        if (!change.history) {
            return;
        }
    })
    .pipe(jade())
    .on('error', function (err) {
        handleError(err);
        next();
    });

    stream = stream
    .pipe(gulp.dest(paths.views.out))
    .on('end', next);
});

/*
 * Build the codebase
 */

gulp.task('build', [ 'views' ], function (done) {
    runSequence([ 'styles', 'browserify' ], done);
});

/*
 * LiveReload server task
 */

gulp.task('listen', function (next) {
    server.listen(35729, next);
});

/*
 * Watch the codebase for changes
 */

gulp.task('watch', [ 'build', 'listen' ], function () {
    gulp.watch(paths.browserify.watch, [ 'browserify' ]);
    gulp.watch(paths.styles.watch, [ 'styles' ]);
    gulp.watch(paths.views.watch, [ 'views' ]);
});

/*
 * Default task set to build
 */

gulp.task('default', [ 'build' ]);
