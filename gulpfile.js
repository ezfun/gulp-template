const { src, dest, series, parallel, watch } = require('gulp');
const plugins = require('gulp-load-plugins')();
const del = require('del');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const imagemin = require('gulp-imagemin');


function js(cb) {
  src('./src/js/*.js')
    // .pipe(plugins.uglify())
    // .pipe(dest('./dist/js'))
    .pipe(reload({'stream': true}))
  ;
  cb();
}

function css(cb) {
  src('./src/css/*.scss')
    .pipe(plugins.sass({ outputStyle: 'compressed'}))
    .pipe(plugins.autoprefixer({
      cascade: false,
      remove: false
    }))
    .pipe(reload({stream: true}))
    .pipe(dest('./src/css'))
  ;
  cb();
}

function img(cb) {
  src('src/images-before/**/*')
    .pipe(plugins.changed('src/images'))
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ], {
      verbose: true
    }))
    .pipe(dest('src/images'))
    // .pipe(reload({stream: true}))
  ;
  cb();
}

function html(cb) {
  src('./src/*.html')
    // .pipe(dest('./dist'))
    .pipe(reload({stream: true}))
  ;
  cb();
}

function clean(cb) {
  del('./dist');
  cb();
}

function watcher(cb) {
  watch('./src/js/*.js', js);
  watch('./src/css/*.scss', css);
  // watch('./src/images-before/*', img);
  watch('./src/*.html', html);
  cb();
}

function serve(cb) {
  browserSync.init({
    port: 9000,
    server: {
      baseDir: './src'
    }
  });
  cb();
}
// exports.js = js;
// exports.del = clean;
// exports.styles = css;
exports.images = img;
exports.minify = series([
  img
])
exports.dev = series([
  css,
  serve,
  watcher
]);
exports.default = series([
  clean,
  parallel([
    js,
    css,
    img,
    html,
  ]),
  serve,
  watcher
]);
