const gulp = require('gulp')
const gulppug = require('gulp-pug')
const sass = require('gulp-sass')(require('sass'))
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel');
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const htmlmin = require('gulp-htmlmin')
const imagemin = require('gulp-imagemin')
const size = require('gulp-size')
const newer = require('gulp-newer')
const del = require('del')
const browsersync = require('browser-sync').create()

//Пути к файлам
const paths = {
    pug: {
        src: 'src/*.pug',
        dest: 'dist/'
    },
    html: {
        src: 'src/*.html',
        dest: 'dist/'
    },
    styles: {
        src: 'src/styles/**/*.sass', //путь к изначальному файлу
        dest: 'dist/css' //путь назначения
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js'
    },
    images: {
        src: 'src/img/**',
        dest: 'dist/img'
    }
}

//Очистка каталогов
function clean() {
    return del(['dist/*', '!dist/img'])
}

//Задача для обработки pug
function pug() {
    return gulp.src(paths.pug.src)
        .pipe(gulppug())
        .pipe(size({ showFiles: true }))
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browsersync.stream())
}

//Задача для обработки html
function html() {
    return gulp.src(paths.html.src)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(size({ showFiles: true }))
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browsersync.stream())
}

//Задача для обработки стилей
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass(undefined, undefined).on('error', sass.logError))
        .pipe(postcss([autoprefixer({ cascade: false })]))
        .pipe(concat("main.min.css"))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(sourcemaps.write())
        .pipe(size({ showFiles: true }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browsersync.stream())
}

//Задача для обработки скриптов
function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(size({ showFiles: true }))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browsersync.stream())
}

//Задача для сжатия изображений
function img() {
    return gulp.src(paths.images.src)
        .pipe(newer(paths.images.dest))
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(size())
        .pipe(gulp.dest(paths.images.dest))
}

//Наблюдение изменений в html, стилях, скриптах и картинках
function watch() {
    browsersync.init({
        server: {
            baseDir: "./dist/"
        }
    })
    gulp.watch(paths.html.dest).on('change',browsersync.reload)
    gulp.watch(paths.pug.src, pug)
    gulp.watch(paths.html.src, html)
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
    gulp.watch(paths.images.src, img)
}

//Финальная сборка
//Оставить только pug если работать только с pug и убрать html
const build = gulp.series(clean, html, pug, gulp.parallel(styles, scripts, img), watch)

exports.clean = clean;
exports.img = img;
exports.pug = pug;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
exports.default = build;
