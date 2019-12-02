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

import { Tree } from '@angular-devkit/schematics/src/tree/interface';

import { SchematicContext, Rule } from '@angular-devkit/schematics';
import { readFileFromTree, getMatchingFilesFromTree } from '../../utils';

const toReplaceSelectors = [
  {
    from: '~@dynatrace/angular-components',
    to: '~@dynatrace/barista-components',
  },
  {
    from: "@import '~@dynatrace/barista-components/style/font-styles';\n",
    to: '',
  },
  {
    from: "@import '~@dynatrace/angular-components/style/font-styles';\n",
    to: '',
  },
  { from: 'dt-card-actions-spacing', to: 'dt-button-child-button-spacing' },
];

export function removeCssSelectors(): Rule {
  return (tree: Tree, _: SchematicContext) => {
    const files = getMatchingFilesFromTree(tree, filePath =>
      filePath.endsWith('.scss'),
    );

    for (const file of files) {
      let content = readFileFromTree(tree, file);
      for (let i = 0; i < toReplaceSelectors.length; i++) {
        const toReplace = toReplaceSelectors[i];
        if (content.includes(toReplace.from)) {
          content = content.split(toReplace.from).join(toReplace.to);
        }
      }
      tree.overwrite(file, content);
    }
  };
}
