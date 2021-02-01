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

import { readFileSync } from 'fs';
import { join } from 'path';
import { resolveModuleFileName } from './resolve-module-filename';

interface ModuleMappings {
  bin: string;
  modules: { [key: string]: string[] };
  root: string;
  workspace: string;
}

// The bazel workspace name
const workspaceName = process.env.BAZEL_WORKSPACE;
// Get the module mappings out of the module mappings file from bazel
const [bazelPackage, bazelTarget] = process.env.BAZEL_TARGET!.split(':');
const moduleMappingFile = join(
  process.cwd(),
  bazelPackage.replace('//', ''),
  `_${bazelTarget}.module_mappings.json`,
);

if (!moduleMappingFile) {
  throw new Error('No bazel test directory provided!');
}

const mappings: ModuleMappings = JSON.parse(
  readFileSync(moduleMappingFile, 'utf-8'),
) as ModuleMappings;
const moduleMappings = new Map<string, string>();

for (const [key, value] of Object.entries(mappings.modules)) {
  // As the paths are an array in the tsConfig use the first one for resolving.
  const startsWithBazelOut = value.find((path) => path.startsWith('bazel-out'));
  if (startsWithBazelOut) {
    moduleMappings.set(
      key,
      startsWithBazelOut.replace(/^bazel-out.+\/bin\//, ''), //replace the bazel out as we want to resolve it in the test.sh.runfiles folder
    );
  }
}

/**
 * Try to resolve a moduleId based on the module mappings that are created by bazel
 * @param moduleId The module id that should be resolved
 */
export function resolvePath(moduleId: string) {
  let module = moduleMappings.get(moduleId);
  if (module) {
    return resolveModuleFileName(module);
  }

  const item = [...moduleMappings.keys()].find((item) =>
    moduleId.startsWith(item),
  );

  if (item) {
    module = moduleMappings.get(item);
    if (module) {
      return resolveModuleFileName(moduleId.replace(item, module));
    }
  }

  // If we cannot replace the file with a mapping then it might be inside a module without
  // module name so the moduleId will consist out of `dynatrace/path/to/module`
  return resolveModuleFileName(moduleId.replace(`${workspaceName}/`, ''));
}
