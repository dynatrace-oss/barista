/**
 * @license
 * Copyright 2021 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { sync } from 'resolve';
import { resolvePath } from './utils/resolve-path';

// The bazel workspace name
const workspaceName = process.env.BAZEL_WORKSPACE!;

const runFilesHelper = require(`${process.env.BAZEL_NODE_RUNFILES_HELPER}`);

/** Resolves a module id for jest */
function moduleResolver(moduleId: string, options: any): any {
  // Ignore css files
  if (moduleId.endsWith('.css')) {
    return;
  }

  if (moduleId === 'lodash-es') {
    return runFilesHelper.resolve('npm/lodash-es/lodash-es.umd.js');
  }

  // resolve workspace imports with the bazel module mappings
  if (
    moduleId.startsWith(`@${workspaceName}`) ||
    moduleId.startsWith(workspaceName)
  ) {
    const resolved = resolvePath(moduleId);
    // if undefined it might be a published @dynatrace import that has to be resolved
    // via the node_modules with the `sync` operation later on
    if (resolved) {
      return resolved;
    }
  }

  try {
    return options.defaultResolver(moduleId, options);
  } catch {
    return sync(moduleId, {
      basedir: options.basedir,
      preserveSymlinks: false,
    });
  }
}

// Needs to be exported like this for jest
module.exports = moduleResolver;
