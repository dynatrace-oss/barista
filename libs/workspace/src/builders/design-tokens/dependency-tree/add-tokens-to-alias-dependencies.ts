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

import { BuilderContext } from '@angular-devkit/architect';
import { promises as fs } from 'fs';
import { join } from 'path';
import { forkJoin, from, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { parse } from 'yaml';
import { DependencyGraph } from './dependency-graph';
import { findSourceFiles } from './find-source-files';
import { DesignTokensDependencyTreeOptions } from './schema';
import {
  DesignTokenSource,
  DesignTokenProp,
} from '../interfaces/design-token-source';

/** Process the token file and add dependencies to the graph.  */
export function processTokenFile(
  dependencyGraph: DependencyGraph,
  tokens: DesignTokenSource,
): void {
  // Itereate through all the props within a token file and create a token
  // for each prop defined here.
  // Additionally will create an alias type token, if
  // one is used in the value of the prop
  const props: DesignTokenProp[] = Array.isArray(tokens.props)
    ? tokens.props
    : Array.from(
        Object.values(tokens.props as { [key: string]: DesignTokenProp }),
      );
  for (const { name, value } of props ?? []) {
    const re = /{!(.+?)}/g;
    // check if the value is a string as we need to deal
    // with sub value tokens as well.
    let values: string[] = [];
    if (typeof value === 'string') {
      values = [value];
    } else {
      values = Object.values(value);
    }
    // iterate over the found values
    for (const processValue of values) {
      let match: RegExpExecArray | null;
      do {
        match = re.exec(processValue);
        if (match) {
          dependencyGraph.addDependency(
            {
              name,
              type: 'token',
            },
            { name: match[1], type: 'alias' },
          );
        }
      } while (match);
    }
  }
}

export function addTokensToAliasDependenciesToGraph(
  dependencyGraph: DependencyGraph,
  context: BuilderContext,
  options: DesignTokensDependencyTreeOptions,
): Observable<DependencyGraph> {
  return findSourceFiles(
    options.tokenEntrypoints || [],
    join(context.workspaceRoot, options.baseDirectory),
  ).pipe(
    switchMap((files) => {
      const fileProcesses = files.map((file) =>
        // Read the token files
        from(
          fs.readFile(join(options.baseDirectory, file), { encoding: 'utf-8' }),
        ).pipe(
          // Yaml parse the files
          map((tokenFile: string) => parse(tokenFile)),
          // Run the file through the processor
          tap((tokens: DesignTokenSource) =>
            processTokenFile(dependencyGraph, tokens),
          ),
        ),
      );
      return forkJoin(fileProcesses);
    }),
    map(() => dependencyGraph),
  );
}
