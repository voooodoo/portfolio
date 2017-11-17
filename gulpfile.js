const gulp = require('gulp')
	, pug = require('gulp-pug')
	, fs = require('fs')
	, browserSync = require('browser-sync').create()
	, reload = browserSync.reload
	, sass = require('gulp-sass')
	, plumber = require('gulp-plumber')
	, spritesmith = require('gulp.spritesmith')
	, sassGlob = require('gulp-sass-glob')
	, sourcemaps = require('gulp-sourcemaps')
	, csso = require('gulp-csso')
	, autoprefixer = require('gulp-autoprefixer')
	, cssunit = require('gulp-css-unit');

// server
gulp.task('server', function() {
	browserSync.init({
		server: {
			baseDir: "./dist",
		}
	});
});

gulp.task('sass', () => {
	return gulp.src('./src/styles/main.scss')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(autoprefixer({
			browsers : ['> 5%'],
			cascade : false
		}))
		.pipe(cssunit({
			type     :    'px-to-rem',
			rootSize  :    16
		}))
		.pipe(csso())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/css/'))
		.pipe(reload({stream : true}));
});

gulp.task('pug', () => {

	gulp.src('src/views/pages/**/*.pug')
		.pipe(plumber())
		.pipe(pug({
			locals : JSON.parse(fs.readFileSync('./content.json', 'utf8')),
			pretty: true,
		}))
		.pipe(gulp.dest('dist'))
		.pipe(reload({stream : true}));
});

gulp.task('sprite', function () {
	var spriteData = gulp.src(
		'./src/img/icons/*.png'
	).pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: 'sprite.scss',
		cssFormat: 'css',
		imgPath: '../img/sprite.png',
		padding: 70
	}));

	spriteData.img.pipe(gulp.dest('./dist/img'));
	spriteData.css.pipe(gulp.dest('./src/styles/sprite'));
});

gulp.task('watch', () => {
	gulp.watch('src/**/*.pug', ['pug']);
	gulp.watch('src/styles/**/*.scss', ['sass']);
});

gulp.task('default', ['sass', 'pug','sprite', 'server', 'watch']);