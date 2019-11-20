var gulp = require('gulp'),
	gutil = require('gulp-util'),
	scss = require('gulp-sass'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify-es').default,
	cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer'),
	notify = require("gulp-notify"),
	reload      = browserSync.reload;	 

// Скрипты проекта
gulp.task('jslibs', function () {
	return gulp.src([
		'libs/jquery.js',
		'js/common.js' // Всегда в конце
		])
		.pipe(concat('common.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/assets/js'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('scripts', function () {
	return gulp.src('js/*.js')
		//.pipe(uglify())
		.pipe(rename({
			suffix: '.min',
			prefix: ''
		}))
		.pipe(gulp.dest('dist/assets/js'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: 'dist'
		},
		notify: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

gulp.task('scss', function () {
	return gulp.src(['scss/*.scss','scss/**/*.scss'])
		.pipe(scss({
			outputStyle: 'expand'
		}).on("error", notify.onError()))
		.pipe(rename({
			suffix: '.min',
			prefix: ''
		}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
		.pipe(gulp.dest('dist/assets/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('watch', function () {
	gulp.watch(['scss/*.scss', 'scss/**/*.scss'], gulp.parallel('scss'));
	gulp.watch(['libs/*.js', 'js/common.js'], gulp.parallel('jslibs'));
	gulp.watch('js/*.js', gulp.parallel('scripts'));
    gulp.watch('img/*.jpg', 'img/*.png', gulp.parallel('imagemin'));
	gulp.watch('dist/*.html').on('change', reload);
});

gulp.task('imagemin', function () {
	return gulp.src('img/**/*')
		.pipe(cache(imagemin()))
		.pipe(gulp.dest('dist/images'));
});

gulp.task('clearcache', function () {
	return cache.clearAll();
});

gulp.task('default', gulp.parallel('watch', 'scss', 'jslibs', 'scripts', 'imagemin', 'browser-sync'));
