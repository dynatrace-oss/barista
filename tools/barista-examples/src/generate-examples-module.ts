/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

import { ExamplePackageMetadata } from './metadata';
import { join } from 'path';

import {
  transformAndWriteTemplate,
  // generateExampleImportStatements,
} from './util';

/** Generates the examples-module where all example components are declared. */
export async function generateExamplesModule(
  examplesMetadata: ExamplePackageMetadata[],
  root: string,
): Promise<string> {
  const templateFile = join(root, 'examples.module.template');
  const moduleFile = join(root, 'examples.module.ts');

  return transformAndWriteTemplate(
    source => {
      const exampleModuleNames = examplesMetadata.map(
        metadata => metadata.moduleClassName,
      );
      const joinedModuleNames = `  ${exampleModuleNames.join(',\n  ')}`;
      source = source.replace('${exampleModules}', joinedModuleNames);

      const imports = `import {\n${joinedModuleNames}\n} from '@dynatrace/barista-components/examples';`;
      source = source.replace('${imports}', imports);

      return source;
    },
    templateFile,
    moduleFile,
  );
}
