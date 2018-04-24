var gulp = require('gulp');
var sass = require('gulp-sass');
var watchSass = require("gulp-watch-sass")
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var cleanCss = require('gulp-clean-css');
var gulpIf = require('gulp-if');

var config = {
    paths: {
        scss: './scss/**/*.scss'
    },
    output: {
        cssName: './bundle.min.css',
        path: './'
    },
    isDevelop: false
};

gulp.task('scss', function () {
    return gulp.src(config.paths.scss)
        .pipe(gulpIf(config.isDevelop, sourcemaps.init()))
        .pipe(sass())
        .pipe(concat(config.output.cssName))
        .pipe(autoprefixer())
        .pipe(gulpIf(!config.isDevelop, cleanCss()))
        .pipe(gulpIf(config.isDevelop, sourcemaps.write()))
        .pipe(gulp.dest(config.output.path));
});

gulp.task('watch',function() {
    gulp.watch(config.paths.scss,['scss']);
});

gulp.task('default', ['scss', 'watch']);