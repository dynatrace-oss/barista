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

import { BaristaExampleMetadata } from './metadata';
import { join, basename } from 'path';

import {
  transformAndWriteTemplate,
  generateExampleImportStatements,
} from './util';
import { EXAMPLES_ROOT } from './main';

/** Generates a list of nav items for the barista-examples menu. */
export async function generateExamplesNavItems(
  examplesMetadata: BaristaExampleMetadata[],
): Promise<string> {
  const templateFile = join(EXAMPLES_ROOT, 'nav-items.template');
  const moduleFile = join(EXAMPLES_ROOT, 'nav-items.ts');

  return transformAndWriteTemplate(
    source => {
      const imports = generateExampleImportStatements(examplesMetadata);
      source = source.replace('${imports}', imports);

      const navItemMap = new Map<string, { name: string; route: string }[]>();

      for (const metadata of examplesMetadata) {
        let exampleNavItems = navItemMap.get(metadata.packageName);
        if (!exampleNavItems) {
          exampleNavItems = [];
          navItemMap.set(metadata.packageName, exampleNavItems);
        }
        const name = basename(metadata.tsFileLocation).slice(0, -3);
        exampleNavItems.push({ name, route: `/${name}` });
      }

      const navItems = Array.from(navItemMap)
        .map(
          ([packageName, exampleNavItems]) =>
            ` ${JSON.stringify(
              {
                name: packageName,
                examples: exampleNavItems,
              },
              null,
              2,
            )}`,
        )
        .join(',\n');
      source = source.replace('${navItems}', navItems);

      return source;
    },
    templateFile,
    moduleFile,
  );
}
