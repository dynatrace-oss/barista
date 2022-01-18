/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import { BuilderContext } from '@angular-devkit/architect';
import { Observable, forkJoin } from 'rxjs';
import { tryJsonParse, PackageJson } from '@dynatrace/shared/node';
import { join } from 'path';
import { promises as fs } from 'fs';
import { map, tap, switchMap } from 'rxjs/operators';
import { syncDependencyVersions } from './sync-package-dependencies';

/**
 * Syncs the projects package.json and the release package.json and writes the
 * result to the output.
 * Syncs the following things.
 * * dependency versions given in the releasePackageJson from project to release.
 * * package version from project to release.
 * * author, repository other relevant meta information from project to release.
 */
export function copyRootPackageJson(
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
