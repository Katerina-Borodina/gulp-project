const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const del = require('del');

//Пути к файлам
const paths = {
    styles: {
        src: 'src/styles/**/*.sass', //путь к изначальному файлу
        dest: 'dist/css' //путь назначения
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js'
    }
}

//Очистка каталогов
function clean() {
    return del(['dist']);
}

//Задача для обработки стилей
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sass())
        .pipe(concat("main.min.css"))
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.styles.dest));
}

//Задача для обработки скриптов
function scripts() {
    return gulp.src(paths.scripts.src,{
        sourcemaps: true
    })
        .pipe(babel())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest));

}

//Наблюдение изменений в стилях и скриптах
function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
}

//Финальная сборка
const build = gulp.series(clean, gulp.parallel(styles, scripts), watch);

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
exports.default = build;