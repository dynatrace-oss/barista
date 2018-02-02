const gulp = require("gulp");
const through = require("through2");
const ngPackagr = require("ng-packagr/lib/ng-packagr");

const DIST_DIR = "dist";

const ngPackage = () => through.obj((file, encoding, callback) => {
    ngPackagr.createNgPackage({
            project: file.path
        })
        .then(result => callback(null, result))
        .catch(error => callback(error, null));
});

gulp.task("symlink:node_modules", () =>
    gulp.src("node_modules")
        .pipe(gulp.symlink(DIST_DIR))
);

gulp.task("symlink:styles", () =>
    gulp.src("src/styles")
        .pipe(gulp.symlink(DIST_DIR))
);

gulp.task("symlink", gulp.parallel("symlink:styles", "symlink:node_modules"));

gulp.task("package-lib", () =>
    gulp.src("ng-package.json", {
            read: false,
        })
        .pipe(ngPackage())
);

gulp.task("copy:styles", () =>
    gulp.src("src/styles")
        .pipe(gulp.dest(DIST_DIR))
);

gulp.task("dev", gulp.series("package-lib", "symlink"));

gulp.task("watch", () =>
    gulp.watch("src", gulp.series("dev"))
);

gulp.task("build", gulp.series("package-lib", "copy:styles"));
