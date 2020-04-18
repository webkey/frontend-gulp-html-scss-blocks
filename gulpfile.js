'use strict';

var gulp             = require('gulp'),
    sass             = require('gulp-sass'),
    sassGlob         = require('gulp-sass-glob'),
    browserSync      = require('browser-sync').create(),
    plumber          = require('gulp-plumber'),
    notify           = require("gulp-notify"),
    errorHandler     = require('gulp-error-handle'),
    reload           = browserSync.reload,
    concat           = require('gulp-concat'),
    babel            = require('gulp-babel'),
    postcss          = require('gulp-postcss'),
    autoprefixer     = require('autoprefixer'),
    cssnano          = require('cssnano'),
    gcmq             = require('gulp-group-css-media-queries'),
    concatCss        = require('gulp-concat-css'),
    uglify           = require('gulp-uglifyjs'),
    del              = require('del'),
    imagemin         = require('gulp-imagemin'),
    pngquant         = require('imagemin-pngquant'),
    cache            = require('gulp-cache'),
    sourcemaps       = require('gulp-sourcemaps'),
    fileinclude      = require('gulp-file-include'),
    markdown         = require('markdown'),
    htmlbeautify     = require('gulp-html-beautify'),
    fs               = require('fs'),
    revts            = require('gulp-rev-timestamp'),
    sassLint         = require('gulp-sass-lint'),
    eslint           = require('gulp-eslint'),
    index            = require('gulp-index'); // Для создания списка страниц https://www.npmjs.com/package/gulp-index

var path = {
  'dist': 'dist'
};

gulp.task('html:compilation', function () {
  return gulp.src(['!app/_tpl_*.html', 'app/*.html'])
      .pipe(plumber())
      .pipe(fileinclude({
        basepath: 'app',
        filters: {
          markdown: markdown.parse
        }
      }))
      .pipe(gulp.dest('./' + path.dist));
});

gulp.task('html:production', function () {
  return gulp.src(['!app/_tpl_*.html', 'app/*.html'])
      .pipe(plumber())
      .pipe(fileinclude({
        basepath: 'app',
        filters: {
          markdown: markdown.parse
        }
      }))
      .pipe(htmlbeautify({
        "indent_size": 2,
        "max_preserve_newlines": 0
      }))
      .pipe(revts())
      .pipe(gulp.dest('./' + path.dist));
});

gulp.task('html:buildAllPages', ['html:compilation'], function () {
  var pref = "all-pages";
  return gulp.src(['!app/all-pages.html', '!app/__*.html', '!app/~*.html', '!app/_tpl_*.html', '!app/_temp_*.html', './app/*.html'])
      .pipe(index({
        // written out before index contents
        'prepend-to-output': () => `<head> <title>All pages</title><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0"><link rel="shortcut icon" href="favicon.ico"></head><body>`,
        'title': 'All pages',
        'title-template': (title) => `<h1 class="` + pref + `__title">${title}</h1>`,
        'section-template': (sectionContent) => `<section class="` + pref + `__section"> ${sectionContent}</section>`,
        'section-heading-template': (heading) => `<!--<h2 class="` + pref + `__section-heading">${heading}</h2>-->`,
        'list-template': (listContent) => `<ul class="` + pref + `__list"> ${listContent}</ul>`,
        'item-template': (filepath, filename) => `<li class="` + pref + `__item"><a class="` + pref + `__item-link" href="./${filename}">${filename}</a></li>`,
        'outputFile': './all-pages.html'
      }))
      .pipe(htmlbeautify({
        "indent_size": 2,
        "max_preserve_newlines": 0
      }))
      .pipe(gulp.dest('./' + path.dist));
});

gulp.task('style:compilation', function () {
  var plugins = [
    autoprefixer(),
  ];
  return gulp.src('app/styles/*.+(scss|sass)')
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sassGlob())
      .pipe(sass({
        outputStyle: 'expanded',
        indentType: 'space',
        indentWidth: 2,
        precision: 3,
        linefeed: 'lf'
      }).on('error', sass.logError))
      .pipe(postcss(plugins))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./' + path.dist + '/css'))
});

gulp.task('styles:lint', () => (
    gulp.src('app/**/*.+(scss|sass)')
        .pipe(sassLint({
          configFile: '.sass-lint.yml'
        }))
        .pipe(sassLint.format())
));

gulp.task('style:production', function () {
  var plugins = [
    autoprefixer(),
    cssnano({
      zindex: false,
      autoprefixer: {
        remove: false
      }
    })
  ];

  return gulp.src('app/styles/*.+(scss|sass)')
      .pipe(plumber())
      .pipe(sassGlob())
      .pipe(sass().on('error', sass.logError))
      .pipe(gcmq())
      .pipe(postcss(plugins))
      .pipe(gulp.dest('./' + path.dist + '/css'));
});

const cssLibs = [
  'node_modules/select2/dist/css/select2.min.css'
];
gulp.task('cssLibs:merge', function () {
  if(cssLibs.length) {
    return gulp.src(cssLibs)
        .pipe(concatCss('libs.min.css'))
        .pipe(gulp.dest(path.dist + '/libs/css'));
  }
});

gulp.task('cssLibs:production', function () {
  var plugins = [
    cssnano({
      zindex: false,
      autoprefixer: {
        remove: false
      }
    })
  ];
  if(cssLibs.length) {
    return gulp.src(cssLibs)
        .pipe(concatCss('libs.min.css'))
        .pipe(postcss(plugins))
        .pipe(gulp.dest(path.dist + '/libs/css'));
  }
});

const jsLibs = [
  'node_modules/jquery/dist/jquery.min.js',
  'node_modules/jquery-validation/dist/jquery.validate.min.js',
  'node_modules/select2/dist/js/select2.full.min.js',
  'node_modules/select2/dist/js/i18n/ru.js',
  'node_modules/object-fit-images/dist/ofi.min.js'
];
gulp.task('jsLibs:merge', function () {
  if(jsLibs.length) {
    return gulp.src(jsLibs)
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.dist + '/libs/js'));
  }
});

const jsFiles = [
  'app/scripts/app.js',
  'app/blocks/**/*.js',
  'app/scripts/common/**/*.js',
  'app/scripts/init.js'
];
gulp.task('scripts', function () {
  return gulp.src(jsFiles)
      .pipe(plumber({
        errorHandler: function(err) {
          notify.onError({
            title: "Error ---> JS",
            message: "<%= error.message %>"
          })(err);
        }
      }))
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(concat('app.min.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(path.dist + '/js'));
});
gulp.task('scripts:lint', () => {
  gulp.src(jsFiles)
      .pipe(eslint({ configFile: '.eslintrc'}))
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
});
gulp.task('scripts:production', ['scripts:lint'], function () {
  return gulp.src(jsFiles)
      .pipe(babel())
      .pipe(uglify())
      .pipe(concat('app.min.js'))
      .pipe(gulp.dest(path.dist + '/js'));
});

gulp.task('copyFavicons', function () {
  return gulp.src('app/favicons/**/*', { dot: true })
      .pipe(gulp.dest(path.dist));
});

gulp.task('copyResources', function () {
  return gulp.src('app/resources/**/*', { dot: true })
      .pipe(gulp.dest(path.dist));
});

gulp.task('copyFonts', function () {
  return gulp.src('app/fonts/**/*')
      .pipe(gulp.dest(path.dist + '/fonts'));
});

gulp.task('copyImages', function () {
  return gulp.src('app/images/**/*')
      .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 7, // from 0 to 7
        use: [pngquant()]
      })))
      .pipe(gulp.dest(path.dist + '/images'));
});

gulp.task('browserSync', function (done) {
  browserSync.init({
    server: {
      baseDir: "./" + path.dist
    },
    open: false,
    notify: false
  });
  browserSync.watch(['app/*.html', 'app/js/**/*.js', 'app/sass/**/*.+(scss|sass)', 'app/includes/**/*.json', 'app/includes/**/*.svg']).on("change", reload);
  done();
});

gulp.task('watch', ['browserSync', 'html:compilation', 'style:compilation', 'styles:lint', 'cssLibs:merge', 'jsLibs:merge', 'copyFavicons', 'copyResources', 'copyFonts', 'scripts', 'copyImages'], function () {
  gulp.watch(['app/*.html', 'app/blocks/**/*.html', 'app/includes/**/*'], ['html:compilation']);
  gulp.watch('app/{styles,blocks}/**/*.+(scss|sass)', ['style:compilation', 'styles:lint']);
  gulp.watch('app/favicons/**/*', ['copyFavicons']);
  gulp.watch('app/resources/**/*', ['copyResources']);
  gulp.watch('app/fonts/**/*', ['copyFonts']);
  gulp.watch('app/scripts/**/*', ['scripts']);
  gulp.watch('app/images/**/*', ['copyImages']);
});

gulp.task('default', ['watch']);

/**
 * Create Production
 */

gulp.task('production', ['cleanDist', 'html:production', 'style:production', 'cssLibs:production', 'jsLibs:merge', 'copyFavicons', 'copyResources', 'copyFonts', 'scripts:production', 'copyImages']);

gulp.task('cleanDist', function () {
  return del.sync([path.dist + '/']);
});

gulp.task('clearCache', function () {
  return cache.clearAll();
});