/**
 * @license
 * Based on the build of angular/material2 by Google Inc. governed by an
 * MIT-style license that can be found in the LICENSE file at https://angular.io/license
 */
import * as fs from 'fs';
import * as path from 'path';
import { buildConfig } from '../build-config';

/* Those imports lack typings. */
const gulpConnect = require('gulp-connect');

// There are no type definitions available for these imports.
const httpRewrite = require('http-rewrite-middleware');

/**
 * Create a task that serves a given directory in the project.
 * The server rewrites all node_module/ or dist/ requests to the correct directory.
 */
export const serverTask = (packagePath: string, livereload = true) => {
  // The http-rewrite-middlware only supports relative paths as rewrite destinations.
  const relativePath = path.relative(buildConfig.projectDir, packagePath);

  return () => {
    gulpConnect.server({
      root: buildConfig.projectDir,
      livereload,
      port: 4200,
      middleware: () =>
        [httpRewrite.getMiddleware([
          // Rewrite the node_modules/ and dist/ folder to the real paths. This is a trick to
          // avoid that those folders will be rewritten to the specified package path.
          { from: '^/node_modules/(.*)$', to: '/node_modules/$1' },
          { from: '^/dist/(.*)$', to: '/dist/$1' },
          // Rewrite every path that doesn't point to a specific file to the index.html file.
          // This is necessary for Angular's routing using the HTML5 History API.
          { from: '^/[^.]+$', to: `/${relativePath}/index.html` },
          // Rewrite any path that didn't match a pattern before to the specified package path.
          { from: '^(.*)$', to: `/${relativePath}/$1` },
        ])],
    });
  };
};
