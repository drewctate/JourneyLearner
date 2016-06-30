'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var watch = require('gulp-watch');

var cssGlob = ['main.less', 'modules/**/*.less'];
gulp.task('css', function () {
	gulp.src(cssGlob)
		.pipe(concat('main.css'))
		.pipe(less())
		.pipe(autoprefixer({
			remove: false
		}))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./'))
		.pipe(reload({stream: true}));
});

gulp.task('serve', ['css'], function () {
	browserSync.init({
		server: {
			baseDir: ['.generated', './']
		},
		port: 9000
	});
    watch(cssGlob, function () {
		gulp.start('css');
	});
});