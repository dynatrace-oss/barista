'use strict';
/**
 * Load the TypeScript compiler, then load the TypeScript gulpfile which simply loads all
 * the tasks. The tasks are really inside tools/gulp/tasks.
 */

const path = require('path');

const tsconfigPath = path.join(__dirname, 'tools/gulp/tsconfig.json');
const tsconfig = require(tsconfigPath);

// Register TS compilation.
require('ts-node').register({
  project: tsconfigPath
});

// The gulp tsconfig file maps specific imports to relative paths. In combination with ts-node
// this doesn't work because the JavaScript output will still refer to the imports instead of
// to the relative path. Tsconfig-paths can be used to support path mapping inside of Node.
require('tsconfig-paths').register({
  baseUrl: path.dirname(tsconfigPath),
  paths: tsconfig.compilerOptions.paths
});

require('./tools/gulp/gulpfile');


// const gulp = require("gulp");
// const through = require("through2");
// const packagr = require("@dynatrace/ng-packagr/lib/ng-v5/packagr");

// const DIST_DIR = "build/dist";

// const ngPackage = () => through.obj((file, encoding, callback) => {
//     packagr.ngPackagr()
//         .forProject(file.path)
//         .build()
//         .then(result => callback(null, result))
//         .catch(error => callback(error, null));
// });

// gulp.task("symlink:styles", () =>
//     gulp.src("src/components/styles")
//         .pipe(gulp.symlink(DIST_DIR))
// );

// gulp.task("package-lib", () =>
//     gulp.src("src/lib/package.json", {
//             read: false,
//         })
//         .pipe(ngPackage())
// );

// gulp.task("copy:styles", () =>
//     gulp.src("src/components/styles/**")
//         .pipe(gulp.dest(`${DIST_DIR}/styles`))
// );

// gulp.task("dev-build", gulp.series("package-lib", "symlink:styles"));

// gulp.task("watch", () =>
//     gulp.watch("src", gulp.series("dev-build"))
// );

// gulp.task("build", gulp.series("package-lib", "copy:styles"));
