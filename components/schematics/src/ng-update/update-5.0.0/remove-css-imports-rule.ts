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

import { Tree } from '@angular-devkit/schematics/src/tree/interface';

import { SchematicContext, Rule } from '@angular-devkit/schematics';
import { readFileFromTree } from '../../utils';

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
  { from: 'default-font', to: 'dt-default-font' },
  { from: 'h1-font', to: 'dt-h1-font' },
  { from: 'h2-font', to: 'dt-h2-font' },
  { from: 'h3-font', to: 'dt-h3-font' },
  { from: 'code-font', to: 'dt-code-font' },
  { from: 'label-font', to: 'dt-label-font' },
];

export function removeCssSelectors(): Rule {
  return (tree: Tree, _: SchematicContext) => {
    tree.visit(filePath => {
      if (filePath.match(/\.scss$/)) {
        let content = readFileFromTree(tree, filePath);
        for (let i = 0; i < toReplaceSelectors.length; i++) {
          const toReplace = toReplaceSelectors[i];
          if (content.includes(toReplace.from)) {
            content = content.split(toReplace.from).join(toReplace.to);
          }
        }
        tree.overwrite(filePath, content);
      }
    });
  };
}
