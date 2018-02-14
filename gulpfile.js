const gulp = require("gulp");
const through = require("through2");
const ngPackagr = require("ng-packagr/lib/ng-packagr");

const DIST_DIR = "build/dist";

const ngPackage = () => through.obj((file, encoding, callback) => {
    ngPackagr.createNgPackage({
            project: file.path
        })
        .then(result => callback(null, result))
        .catch(error => callback(error, null));
});

gulp.task("symlink:styles", () =>
    gulp.src("src/components/styles")
        .pipe(gulp.symlink(DIST_DIR))
);

gulp.task("package-lib", () =>
    gulp.src("ng-package.json", {
            read: false,
        })
        .pipe(ngPackage())
);

gulp.task("copy:styles", () =>
    gulp.src("src/components/styles/**")
        .pipe(gulp.dest(`${DIST_DIR}/styles`))
);

gulp.task("dev-build", gulp.series("package-lib", "symlink:styles"));

gulp.task("watch", () =>
    gulp.watch("src", gulp.series("dev-build"))
);

gulp.task("build", gulp.series("package-lib", "copy:styles"));
