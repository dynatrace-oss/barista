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
import { join } from 'path';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap, tap } from 'rxjs/operators';
import { ElementsPackageAllOptions } from './schema';
import { tryJsonParse } from '@dynatrace/shared/node';
import { NxJson } from '@nrwl/workspace';

/**
 * Custom builder for the web-components package builder.
 * This builder will schedule and run all projects that are tagged
 * with a given tag in the nx.json. It is primarily used to run and package
 * the web-components part of the library.
 */
export function elementsBuildAndPackageBuilder(
  options: ElementsPackageAllOptions,
  context: BuilderContext,
): Observable<BuilderOutput> {
  const project = context.target?.project ?? '';
  context.logger.info(`Packaging ${project}...`);

  // Get all builds that are tagged with elements
  context.logger.info('Reading nx.json file...');
  return from(
    tryJsonParse<NxJson>(join(context.workspaceRoot, 'nx.json')),
  ).pipe(
    // Find the projects that need to be built as part of the elements build.
    map((nxJson: NxJson) =>
      filterTaggedProjects(
        nxJson,
        options.buildTag || 'scope:elements',
        project,
      ),
    ),
    // Create and schedule all other builds.
    switchMap((targetProjects: string[]) => {
      const builds = createProjectStreams(context, targetProjects, 'build');
      return forkJoin(builds).pipe(
        switchMap(() =>
          forkJoin(
            ...createProjectStreams(context, targetProjects, 'package', {
              packageVersion: options.packageVersion,
            }),
          ),
        ),
      );
    }),
    tap(() => context.logger.info('Build successful.')),
    mapTo({
      success: true,
    }),
    catchError((error) => {
      console.log(error);
      return of({
        success: false,
        error: (error as Error).message,
      });
    }),
  );
}

/** Filter incoming projects based on the tag defined in the options. */
function filterTaggedProjects(
  nxJson: NxJson,
  buildTag: string,
  selfProject: string,
): string[] {
  return (
    Object.entries(nxJson.projects)
      // filter out the starter project (self)
      .filter(([project]) => project !== selfProject)
      // filter in all projects that include the selected tag
      .filter(([_project, { tags }]) => tags?.includes(buildTag))
      .map(([project]) => project)
  );
}

/** Create a builder stream array for all targets. */
function createProjectStreams(
  context: BuilderContext,
  targetProjects: string[],
  target: string,
  customOptions: any = {},
): Observable<BuilderOutput>[] {
  return targetProjects.map((targetProject: string) => {
    return from(
      context.scheduleTarget(
        {
          target: target,
          project: targetProject,
        },
        customOptions,
      ),
    ).pipe(
      tap(() => context.logger.info(`Running ${target}: ${targetProject}...`)),
      switchMap((build) => build.result),
      tap((result) => {
        // Throw and break the whole pipe if an error occurs.
        if (result.error) {
          throw new Error(result.error);
        }
        context.logger.info(`Successfully finshed ${target}: ${targetProject}`);
      }),
    );
  });
}
