const gulp = require('gulp')
const rename = require('gulp-rename')
const browserify = require('browserify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')

const jsSrc = 'app.js'
const jsFolder = './src/scripts/'
const jsDist = './dist/js/'
const jsWatch = 'src/scripts/**/*.js'
const jsFiles = [jsSrc]

const styleSrc = 'src/styles/style.scss'
const styleDist = './dist/css/'
const styleWatch = 'src/styles/**/*.scss'

gulp.task('style', function (cb){
    gulp.src(styleSrc)
        .pipe(sourcemaps.init())
        .pipe(sass({
            errorLogToConsole: true,
            outputStyle:'compressed'
        }))
        .on('error', console.error.bind(console))
        .pipe(autoprefixer())
        .pipe(rename({suffix:'.min'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(styleDist))
    cb();
})

gulp.task('js', function (cb) {
    jsFiles.map(function (entry) {
        return browserify({
            entries: [jsFolder + entry]
        })
            .transform(babelify, {presets: ['env']})
            .bundle()
            .pipe(source(entry))
            .pipe(rename({ extname:'.min.js' }))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(jsDist))
    })
    cb();
})

gulp.task('build', gulp.series('js', 'style'));

gulp.task('watch', function() {
    gulp.watch(jsWatch, gulp.series('js'));
    gulp.watch(styleWatch, gulp.series('style'));
});

