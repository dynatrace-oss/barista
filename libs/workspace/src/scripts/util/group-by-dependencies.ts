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

import { groupBy, flatten } from 'lodash';
import { splitArrayIntoChunks } from './split-array-into-chunks';

/**
 * Split the affected projects into chunks by grouping them by their dependencies
 * To run the projects with the same dependencies on the same node.
 * The components are always run on the last node to avoid building two heavy tasks on the same node.
 * Because the last node always consists out of the dependency less projects.
 *
 * @param arr The array of affected projects with their dependencies
 * @param chunkSize The size of the chunks
 */
export function groupByDependencies(
  arr: { project: string; deps: string[] }[],
  chunkSize: number,
): string[][] {
  const withDependencies = arr.filter(({ deps }) => deps.length);
  const dependencyLess = arr.filter(({ deps }) => !deps.length);

  const orderedByDependencies = [
    ...flatten(Object.values(groupBy(withDependencies, ({ deps }) => deps))),
    ...dependencyLess,
  ].map(({ project }) => project);

  const componentsIndex = orderedByDependencies.findIndex(
    (project) => project === 'components',
  );

  if (componentsIndex > -1) {
    // if the components are included move them to the bottom of the stack
    // to avoid being built in the same node as other projects with a lot of dependencies
    // barista-design system for examples.
    const item = orderedByDependencies.splice(componentsIndex, 1)[0];
    orderedByDependencies.push(item);
  }

  return splitArrayIntoChunks(orderedByDependencies, chunkSize);
}
