/*
 * @Author: 白若年 
 * @Date: 2017-09-28 18:51:20 
 * @Last Modified by: 白若年_aquarius
 * @Last Modified time: 2017-09-28 19:42:51
 */
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var connect = require('gulp-connect');
var rev = require('gulp-rev'); //生成md5后缀的
var collector = require('gulp-rev-collector'); //自动替换
var watch = require('gulp-watch'); //检测文件变化的
gulp.task('module', function() {
    browserify({
            entries: ['./entry.js']
        }).bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(rev())
        .pipe(gulp.dest('./'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./'))
})
gulp.task('reloadSrc', function() {
    setTimeout(function() {
        gulp.src(['./index.html', 'rev-manifest.json'])
            .pipe(collector({
                replaceReved: true
            }))
            .pipe(gulp.dest('./'))
    }, 300)
})


gulp.task('httpServer', function() {
    connect.server({
        port: 6660,
        livereload: true
    })
});
gulp.task('reloadPage', function() {
    gulp.src('.')
        .pipe(connect.reload())
})
gulp.task('watch', function() {
    gulp.watch(['./index.html', './js1.js', './js2.js'], ['reloadPage', 'module', 'reloadSrc'])
        //, 

})
gulp.task('default', ['httpServer', 'module', 'watch'])
    //