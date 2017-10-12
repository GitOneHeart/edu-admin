var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-csso');
var nunjucks = require('gulp-nunjucks');
// 浏览器同步刷新
var browserSync = require('browser-sync').create();
// 依赖包
var pkg = require('./package.json');
// 压缩图片
var imagemin=require('gulp-imagemin');
// requirejs
var  requirejs=require('requirejs');

// 编译less
gulp.task('less', function () {
    return gulp.src('./src/css/*.less')
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(gulp.dest('./dist/css'))
})
// 处理html公共部分
gulp.task('html', function () {
    return gulp.src('./src/*.html')
        .pipe(nunjucks.compile())
        .pipe(gulp.dest('./dist/'))
})
    // 直接拷贝js
    gulp.task('js',function(){
        gulp.src('./src/js/**/*')
        .pipe(gulp.dest('./dist/js/'))
    })
// 将第三方包放到dist目录下的vendor文件夹下
gulp.task('vendor', function () {
    // 遍历devDependencies的每一项,返回
    var dependencies = Object.keys(pkg.dependencies).map(function (item) {
        return './node_modules/' + item + '/**/*'
    });
    return gulp.src(dependencies, { 
        base: './node_modules/'
    })
        .pipe(gulp.dest('./dist/vendor'))
})
// 图片压缩
gulp.task('testImagemin', function () {
    gulp.src('src/img/*.{png,jpg,gif,ico}')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

// 默认任务
gulp.task('default', ['less','vendor','testImagemin', 'html','js'], function () {
    // 利用browser-sync同步刷新浏览器
    // 静态服务器
    browserSync.init({
        server: {
            baseDir: './dist/'
        },
        files: './dist/',
        post:8080  
    });
    // less解析玩后 ,同步刷新浏览器,监视less与html的
 
    // 监视  谁改变 就编译谁
    gulp.watch('./src/*.html',function(event){
        gulp.src(event.path)
            .pipe(nunjucks.compile())
                .pipe(gulp.dest('./dist/'))
    })

    gulp.watch('./src/css/*.less',function(event){
        gulp.src(event.path)
            .pipe(less())
            .pipe(gulp.dest('./dist/css'))
    })
        gulp.watch('./src/js/**/*.js',function(event){
            gulp.src(event.path)
            .pipe(gulp.dest('./dist/js'))
        })
})
// 编辑的同时,自动更新  如less和css同步