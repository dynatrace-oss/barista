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

import { ExamplePackageMetadata } from './metadata';
import { join, basename } from 'path';
import { transformAndWriteTemplate } from './util';

/** Generates a list of nav items for the demos app menu. */
export async function generateDemosAppNavItems(
  packageMetadata: ExamplePackageMetadata[],
  root: string,
): Promise<string> {
  const templateFile = join(root, 'nav-items.template');
  const moduleFile = join(root, 'nav-items.ts');

  return transformAndWriteTemplate(
    source => {
      let exampleClassNames: string[] = [];
      const navItems = packageMetadata
        .map(packageMeta => {
          const examples = packageMeta.examples.map(exampleMeta => {
            const name = basename(exampleMeta.tsFileLocation).slice(0, -3);
            exampleClassNames.push(exampleMeta.className);
            return { name, route: `/${name}` };
          });

          return ` ${JSON.stringify(
            {
              name: packageMeta.name,
              examples,
            },
            null,
            2,
          )}`;
        })
        .join(',\n');
      source = source.replace('${navItems}', navItems);

      const imports = `import {\n  ${exampleClassNames.join(
        ',\n  ',
      )}\n} from '@dynatrace/examples';`;
      source = source.replace('${imports}', imports);

      return source;
    },
    templateFile,
    moduleFile,
  );
}
