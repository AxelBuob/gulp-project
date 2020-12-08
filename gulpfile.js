const {
    src,
    dest,
    parallel,
    series,
    watch
} = require('gulp');

// Load plugins
const sass = require('gulp-sass');
const clean = require('gulp-clean');
const changed = require('gulp-changed');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const browsersync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');

// Clean assets
function clear() {
    return src('./assets/*', {
            read: false
        })
        .pipe(clean());
}

// CSS Functions
function css() {
    const source = './src/scss/**/*.scss';
    return src(source)
        .pipe(changed(source))
        .pipe(sass())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(dest('./src/css/'))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(cssnano())
        .pipe(dest('./assets/css/'))
        .pipe(browsersync.stream());
}

// JS function
function js() {
    const source = './src/js/*.js';
    return src(source)
        .pipe(changed(source))
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest('./assets/js/'))
        .pipe(browsersync.stream());
}

// Optimize images
function img() {
    return src('./src/img/*')
        .pipe(imagemin())
        .pipe(dest('./assets/img'));
}

// Watch files
function watchFiles() {
  watch('./src/scss/**/*.scss', css);
  watch('./src/js/*.js', js);
  watch('./src/img/*', img);
}

// BrowserSync
function browserSync() {
    browsersync.init({
        server: {
            baseDir: './'
        },
        port: 3000
    });
}

// Tasks to define the execution of the functions simultaneously or in series
exports.watch = parallel(watchFiles, browserSync);
exports.default = series(clear, parallel(js, css, img));
