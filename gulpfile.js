const gulp = require('gulp'),
    gulpsass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    gulppug = require('gulp-pug'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    rigger = require('gulp-rigger');


gulp.task('sass', function() {
    return gulp.src('src/assets/main.sass')
        .pipe(autoprefixer({
            browserslistrc: ['last 15 versions'],
            cascade: false
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        // ================== minify
        .pipe(gulpsass())
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('html', function() {
    return gulp.src('src/layout/*.pug')
        .pipe(gulppug({
            pretty: true
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.stream());
});

gulp.task('js', function() {
    return gulp.src('src/js/main.js')
        .pipe(rigger())
        // .pipe(uglify())
        // .pipe(babel())==========================
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream());
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './dist'
        },
        notify: false
    })
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.sass', gulp.parallel('sass'));
    gulp.watch('src/js/*.js', gulp.parallel('js'));
    gulp.watch('src/**/*.pug', gulp.parallel('html'));
    gulp.watch('dist/*.html').on('change', browserSync.reload);
});

gulp.task('search', gulp.parallel('browser-sync', 'watch', 'js', 'html', 'sass'));