const fileinclude = require('gulp-file-include');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

    function HTML() {
        return gulp.src('src/app/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist/'));

};

function buildStyles() {
    return gulp.src('src/app/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'));
};

function scripts() {
    return gulp.src('src/app/js/**/*.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
}

async function images() {
    const imagemin = (await import('gulp-imagemin')).default;
    return gulp.src('src/app/imgs/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/imgs'));
}

function reload(done) {
    browserSync.reload();
    done();
}

function watchFiles() {
    browserSync.init({
        server: { baseDir: './dist' }
    });

    gulp.watch('src/app/**/*.html', gulp.series(HTML, reload));
    gulp.watch('src/app/scss/**/*.scss', buildStyles);
    gulp.watch('src/app/js/**/*.js', gulp.series(scripts, reload));
    gulp.watch('src/app/imgs/**/*', images).on('change', browserSync.reload);
}

exports.default = gulp.series(
    gulp.parallel(HTML, buildStyles, scripts, images),
    watchFiles
);