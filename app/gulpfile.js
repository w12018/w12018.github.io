var gulp = require('gulp'),
	gutil = require('gulp-util'),
	scss = require('gulp-sass'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify-es').default,
	cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer'),
	sftp = require('gulp-sftp'),
	notify = require("gulp-notify"),
	reload      = browserSync.reload;	 

// Скрипты проекта
gulp.task('jslibs', function () {
	return gulp.src([
		'app/libs/jquery.js',
		'app/libs/jquery.waypoints.min.js',
   		'app/libs/fancybox/jquery.fancybox.js',
		'app/libs/jquery.slimscroll.min.js',
		'app/libs/swiper/swiper.min.js',
		'app/libs/color-thief.min.js',
		'app/libs/masonry.pkgd.js',
		'app/libs/lightslider/js/lightslider.js',
		'app/libs/calendar/timezone-picker.min.js',
		'app/libs/calendar/bootstrap-year-calendar.js',
		'app/libs/popper.js',
		'app/libs/tooltip.js',
		'app/libs/jquery.nicescroll.js',
		'app/js/common.js' // Всегда в конце
		])
		.pipe(concat('scripts.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/assets/js'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('scripts', function () {
	return gulp.src('app/js/*.js')
		//.pipe(uglify())
		.pipe(rename({
			suffix: '.min',
			prefix: ''
		}))
		.pipe(gulp.dest('app/assets/js'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

gulp.task('scss', function () {
	return gulp.src(['app/scss/*.scss','app/scss/**/*.scss'])
		.pipe(scss({
			outputStyle: 'expand'
		}).on("error", notify.onError()))
		.pipe(rename({
			suffix: '.min',
			prefix: ''
		}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
		.pipe(gulp.dest('app/assets/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('watch', function () {
	gulp.watch(['app/scss/*.scss', 'app/scss/**/*.scss'], gulp.parallel('scss'));
	gulp.watch(['libs/*.js', 'app/js/common.js'], gulp.parallel('jslibs'));
	gulp.watch('app/js/*.js', gulp.parallel('scripts'));
	gulp.watch('app/*.html').on('change', reload);
});

gulp.task('imagemin', function () {
	return gulp.src('app/assets/images/**/*')
		.pipe(cache(imagemin()))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('removedist', function () {
	return del.sync('dist');
});

gulp.task('clearcache', function () {
	return cache.clearAll();
});

gulp.task('deploy', function () {
	return gulp.src('dist/**')
		.pipe(sftp({
			host: 'ipdes.by',
			user: 'ipdesby',
			pass: '***',
			port: 52222,
			remotePath: '/home/ipdesby/public_html/test'
		}));
});

gulp.task('build', gulp.parallel('removedist', 'imagemin', 'scss', 'jslibs', 'scripts'), function () {

	var buildFiles = gulp.src([
		'app/*.html',
		'app/.htaccess',
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'app/css/*.min.css',
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'app/js/*.min.js',
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'app/fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('default', gulp.parallel('watch', 'scss', 'jslibs', 'scripts', 'browser-sync'));
