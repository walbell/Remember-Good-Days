'use strict';

var gulp = require('gulp'),
	jade = require('gulp-jade'),
	browserify = require('gulp-browserify');

/*
 * Paths configuration
 */

var paths = {
	staticDir  : 'www',
    views      : { watch: [ 'templates/**/*.jade'], srcBase: 'templates/', src: 'templates/**/*.jade', out: 'www' },
    browserify : { watch: [ 'js/**/*.js', 'www/**/*.html' ], src: 'js/index.js', out: 'www/js', main: 'index.js' },
    styles     : { watch: [ 'styles/**/*.styl' ], src: 'styles/styles.styl', out: 'www/css' }
};

gulp.task('default', function() {
  // place code for your default task here
});
