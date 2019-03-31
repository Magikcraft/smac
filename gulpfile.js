const gulp = require('gulp')
const ts = require('gulp-typescript')
const tsProject = ts.createProject('tsconfig.json')
const rename = require('gulp-rename')
gulp.task('typescript', function() {
    console.log('Compiling TypeScript...')
    return gulp
        .src(['**/*.ts', '!node_modules/**']) // or tsProject.src()
        .pipe(tsProject())
        .pipe(gulp.dest('.'))
})

gulp.task('copy', function() {
    return gulp
        .src('./bin/smac.js')
        .pipe(rename('smac'))
        .pipe(gulp.dest('./bin/', { mode: 0755 }))
})

gulp.task('build', () => {
    console.log('Hi!')
    gulp.series(['typescript', 'copy'])
})

gulp.task('watch', () => {
    gulp.watch('**/*.ts', gulp.series(['typescript', 'copy']))
})
