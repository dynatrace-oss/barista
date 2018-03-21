/**
 * @license
 * Based on the build of angular/material2 by Google Inc. governed by an
 * MIT-style license that can be found in the LICENSE file at https://angular.io/license
 */
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as gulp from 'gulp';
import * as path from 'path';

import { buildConfig } from '../build-config';

/* Those imports lack typings. */
const gulpConnect = require('gulp-connect');

// There are no type definitions available for these imports.
const resolveBin = require('resolve-bin');
const httpRewrite = require('http-rewrite-middleware');

/** If the string passed in is a glob, returns it, otherwise append '**\/*' to it. */
function _globify(maybeGlob: string, suffix = '**/*') {
  if (maybeGlob.indexOf('*') != -1) {
    return maybeGlob;
  }
  try {
    const stat = fs.statSync(maybeGlob);
    if (stat.isFile()) {
      return maybeGlob;
    }
  } catch (e) {}
  return path.join(maybeGlob, suffix);
}

/** Copy files from a glob to a destination. */
export function copyTask(srcGlobOrDir: string | string[], outRoot: string) {
  if (typeof srcGlobOrDir === 'string') {
    return () => gulp.src(_globify(srcGlobOrDir)).pipe(gulp.dest(outRoot));
  } else {
    return () => gulp.src(srcGlobOrDir.map(name => _globify(name))).pipe(gulp.dest(outRoot));
  }
}

/**
 * Create a task that serves a given directory in the project.
 * The server rewrites all node_module/ or dist/ requests to the correct directory.
 */
export function serverTask(packagePath: string, livereload = true) {
  // The http-rewrite-middlware only supports relative paths as rewrite destinations.
  const relativePath = path.relative(buildConfig.projectDir, packagePath);

  return () => {
    gulpConnect.server({
      root: buildConfig.projectDir,
      livereload: livereload,
      port: 4200,
      middleware: () => {
        return [httpRewrite.getMiddleware([
          // Rewrite the node_modules/ and dist/ folder to the real paths. This is a trick to
          // avoid that those folders will be rewritten to the specified package path.
          { from: '^/node_modules/(.*)$', to: '/node_modules/$1' },
          { from: '^/dist/(.*)$', to: '/dist/$1' },
          // Rewrite every path that doesn't point to a specific file to the index.html file.
          // This is necessary for Angular's routing using the HTML5 History API.
          { from: '^/[^.]+$', to: `/${relativePath}/index.html`},
          // Rewrite any path that didn't match a pattern before to the specified package path.
          { from: '^(.*)$', to: `/${relativePath}/$1` },
        ])];
      }
    });
  };
}
