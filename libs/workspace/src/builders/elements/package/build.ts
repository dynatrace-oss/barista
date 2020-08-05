/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { ElementsPackageOptions } from './schema';
import { Observable, of, from } from 'rxjs';
import { runRollup } from './run-rollup';
import { mapTo, catchError, switchMap, tap } from 'rxjs/operators';
import { RollupOptions } from 'rollup';
import rollupResolve from '@rollup/plugin-node-resolve';
import { resolve, dirname } from 'path';
import { PackageJson, tryJsonParse } from '@dynatrace/shared/node';
import { promises as fs } from 'fs';
import { toClassName } from '@nrwl/workspace';
import { sync } from 'glob';

const alias = require('@rollup/plugin-alias');
const localResolve = require('rollup-plugin-local-resolve');

/**
 * Custom builder for the web-components package builder.
 * This builder will run rollup bundler for each library and
 * finally copy over the package json.
 */
export function elementsPackageBuilder(
  options: ElementsPackageOptions,
  context: BuilderContext,
): Observable<BuilderOutput> {
  let projectJson: PackageJson;
  return from(
    tryJsonParse<PackageJson>(resolve(context.workspaceRoot, options.project)),
  ).pipe(
    tap((packageJson) => (projectJson = packageJson)),
    switchMap((packageJson) => {
      const rollupConfig = createRollupConfig(options, context, packageJson);
      return runRollup(rollupConfig);
    }),
    switchMap(() =>
      tryJsonParse<PackageJson>(resolve(context.workspaceRoot, 'package.json')),
    ),
    switchMap((rootPackageJson) => {
      // Create a releaseable package json and write it to the output path.
      const outputPackageJson = createOutputPackageJson(
        context,
        options.packageVersion || '',
        rootPackageJson,
        projectJson,
      );
      return fs.writeFile(
        resolve(context.workspaceRoot, options.outputPath, 'package.json'),
        JSON.stringify(outputPackageJson, null, 2),
      );
    }),
    // Copy the d.ts files over to the output directory.
    switchMap(() =>
      copyDtsFiles(
        dirname(options.entryFile),
        resolve(context.workspaceRoot, options.outputPath),
      ),
    ),
    // Return a success status if everything went through
    mapTo({
      success: true,
    }),
    // Otherwise report the error to the builder.
    catchError((error) =>
      of({
        success: false,
        error: (error as Error).message,
      }),
    ),
  );
}

/**
 * Generate the rollup config.
 */
function createRollupConfig(
  options: ElementsPackageOptions,
  context: BuilderContext,
  packageJson: PackageJson,
): RollupOptions {
  const rollupConfig: RollupOptions = {
    input: options.entryFile,
    output: [
      {
        format: 'esm',
        file: `${options.outputPath}/${context.target!.project}.esm.js`,
        name: toClassName(context.target!.project),
      },
      {
        format: 'umd',
        file: `${options.outputPath}/${context.target!.project}.umd.js`,
        name: toClassName(context.target!.project),
      },
    ],
    external: [
      'lit-element',
      // Lit-html does have sub-imports, that would not be picked up without
      // a regex.
      /lit-html.*/,
      // Treat other fluid-elements as external dependencies as well.
      /@dynatrace\/fluid\-elements\/*/,
      // Everything that is listed as a dependency within the package.json
      // is also considered an external dependency.
      ...Object.keys(packageJson.dependencies || {}),
    ],
    plugins: [
      alias({
        entries: [
          {
            find: '@dynatrace/fluid-design-tokens',
            replacement: resolve(
              context.workspaceRoot,
              'libs/shared/design-tokens/generated/index.js',
            ),
          },
          {
            find: '@dynatrace/shared/keycodes',
            replacement: resolve(
              context.workspaceRoot,
              'libs/shared/keycodes/src/index.ts',
            ),
          },
        ],
      }),
      localResolve(),
      rollupResolve({
        preferBuiltins: true,
        extensions: ['.js', '.ts'],
      }),
    ],
  };
  return rollupConfig;
}

/** Creates a releaseable package json */
function createOutputPackageJson(
  context: BuilderContext,
  version: string,
  rootPackageJson: PackageJson,
  projectPackageJson: PackageJson,
): PackageJson {
  // Set the version in the main file.
  projectPackageJson.version = version;
  // Set the main file in the package json.
  projectPackageJson.main = `${context.target!.project}.umd.js`;
  // Set the main file in the package json.
  projectPackageJson.module = `${context.target!.project}.esm.js`;
  // Set the typings in the package json.
  projectPackageJson.typings = 'index.d.ts';

  // Sync the dependency versions over.
  for (const dependency of Object.keys(projectPackageJson.dependencies || {})) {
    projectPackageJson.dependencies![dependency] =
      rootPackageJson.dependencies![dependency] ||
      rootPackageJson.devDependencies![dependency];
  }
  return projectPackageJson;
}

/**
 * Copies the d.ts files from the tsc compiled output to the package output folder.
 * Sadly we need to do this manually here, as the rollup copy plugin was not able to
 * maintain the folder structure correctly.
 */
async function copyDtsFiles(
  sourceDir: string,
  outputPath: string,
): Promise<void> {
  const dtsPaths = sync('**/*.d.ts', { cwd: sourceDir });
  for (const file of dtsPaths) {
    const target = resolve(outputPath, file);
    await fs.mkdir(dirname(target), { recursive: true });
    await fs.copyFile(resolve(sourceDir, file), resolve(outputPath, file));
  }
}
