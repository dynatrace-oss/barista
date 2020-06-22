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
import { promises as fs } from 'fs';
import { join } from 'path';
import { forkJoin, Observable, of, from } from 'rxjs';
import { catchError, map, mapTo, switchMap, tap } from 'rxjs/operators';
import { PackageJson, tryJsonParse } from '@dynatrace/shared/node';
import { DesignTokensPackageOptions } from './schema';

/**
 * Package builder for design tokens. Runs the build for the design tokens
 * and packages the files to the output directory.
 */
export function designTokensPackageBuilder(
  options: DesignTokensPackageOptions,
  context: BuilderContext,
): Observable<BuilderOutput> {
  // Start by building the design tokens
  return from(
    context.scheduleTarget(
      {
        target: 'build',
        project: 'shared-design-tokens',
      },
      {
        // Override the outputPath of the tokens build
        // to the one of the package outputPath.
        outputPath: options.outputPath,
      },
    ),
  ).pipe(
    // Wait for the result of the initial builder
    switchMap((build) => build.result),
    // Copy the packageJson and prefill with version
    // sync dependencies when necessary.
    switchMap(() =>
      copyRootPackageJson(
        context,
        options.releasePackageJson,
        options.outputPath,
        options.packageVersion,
      ),
    ),
    mapTo({ success: true }),
    catchError((error: Error) => {
      context.logger.error(error.stack!);
      return of({
        success: false,
      });
    }),
  );
}

// TODO: This can be shared, but the original pull request that introduces this
// is not yet merged
//    VVV

/**
 * Syncs versions from the source to the target package.json
 * @param sourcePackageJson - Package.json that contains all currently used
 * dependencies, devDependecies and peerDependencies that are used in the
 * project.
 * @param targetPackageJson - Package.json that is meant for shipping.
 * It contains the dependency/devDependency key but no version. It will receive
 * the version from the SourePackageJson
 * @param key - Which dependencies from the targetPackageJson should be
 * iterated.
 * @returns The modified targetPackageJson with all versions filled.
 */
function syncDependencyVersions(
  sourcePackageJson: PackageJson,
  targetPackageJson: PackageJson,
  key: 'dependencies' | 'devDependencies' | 'peerDependencies',
): PackageJson {
  // Sync dependency versions, that are referenced in the release package.json
  for (const dependencyKey of Object.keys(targetPackageJson[key]!)) {
    const dependencyVersion =
      sourcePackageJson.dependencies![dependencyKey] ||
      sourcePackageJson.devDependencies![dependencyKey];
    targetPackageJson[key]![dependencyKey] = dependencyVersion;
  }
  return targetPackageJson;
}

/**
 * Syncs the projects package.json and the release package.json and writes the
 * result to the output.
 * Syncs the following things.
 * * dependency versions given in the releasePackageJson from project to release.
 * * package version from project to release.
 * * author, repository other relevant meta information from project to release.
 */
function copyRootPackageJson(
  context: BuilderContext,
  releasePackageJsonPath: string,
  outputPath: string,
  packageVersion?: string,
): Observable<void> {
  context.logger.info(`Reading root package.json and release package.json`);
  return forkJoin(
    tryJsonParse<PackageJson>(join(context.workspaceRoot, 'package.json')),
    tryJsonParse<PackageJson>(
      join(context.workspaceRoot, releasePackageJsonPath),
    ),
  ).pipe(
    map(([projectPackageJson, releasePackageJson]) => {
      context.logger.info(`Syncing dependencies and metadata`);
      // Sync the main package version over
      if (packageVersion) {
        releasePackageJson.version = packageVersion;
      } else {
        releasePackageJson.version = projectPackageJson.version;
      }
      // Sync licence and author over
      releasePackageJson.license = projectPackageJson.license;
      releasePackageJson.author = projectPackageJson.author;

      // Sync the dependencyVersions
      return syncDependencyVersions(
        projectPackageJson,
        releasePackageJson,
        'dependencies',
      );
    }),
    tap(() =>
      context.logger.info(
        `Writing package.json to ${join(outputPath, 'package.json')}`,
      ),
    ),
    switchMap((releasePackageJson: PackageJson) =>
      fs.writeFile(
        join(context.workspaceRoot, outputPath, 'package.json'),
        JSON.stringify(releasePackageJson, null, 2),
      ),
    ),
    tap(() => context.logger.info(`Finished writing root package.json`)),
  );
}
