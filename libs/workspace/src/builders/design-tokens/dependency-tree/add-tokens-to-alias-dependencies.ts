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

export interface TokenFile {
  alias?: { [key: string]: string };
  props?: any[];
}

/** Process the token file and add dependencies to the graph.  */
export function processTokenFile(
  dependencyGraph: DependencyGraph,
  tokens: TokenFile,
): void {
  // Itereate through all the props within a token file and create a token
  // for each prop defined here.
  // Additionally will create an alias type token, if
  // one is used in the value of the prop
  for (const { name, value } of tokens.props || []) {
    const re = /{!(.+?)}/g;
    let match: RegExpExecArray | null;
    do {
      match = re.exec(value);
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
          tap((tokens: TokenFile) => processTokenFile(dependencyGraph, tokens)),
        ),
      );
      return forkJoin(fileProcesses);
    }),
    map(() => dependencyGraph),
  );
}
