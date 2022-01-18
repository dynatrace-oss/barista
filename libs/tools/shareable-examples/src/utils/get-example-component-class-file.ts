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

import { promises as fs } from 'fs';
import { extname, join, resolve } from 'path';
import { tsCreateSourceFile } from '@dynatrace/shared/node';
import { ExampleAstFile } from './examples.interface';

/** Gets the component class file from a example root path. */
export async function getExampleComponentClassFile(
  exampleRoot: string,
): Promise<ExampleAstFile> {
  // Resolve required files.
  const examplesSources = await fs.readdir(exampleRoot);
  const classFilePath = examplesSources.filter(
    (file) => extname(file) === '.ts',
  )[0];

  // Add the exampleComponentClassFile to the dependency files.
  const classFile = await fs.readFile(join(exampleRoot, classFilePath), {
    encoding: 'utf-8',
  });

  // Parse the example typescript file into an AST to evaluate dependencies.
  const classAst = await tsCreateSourceFile(join(exampleRoot, classFilePath));

  return {
    path: resolve(exampleRoot, classFilePath),
    content: classFile,
    ast: classAst,
  };
}
