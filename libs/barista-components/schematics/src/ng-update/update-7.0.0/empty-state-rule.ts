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
import { getMatchingFilesFromTree, readFileFromTree } from '../../utils';
import { TO_REPLACE_EMPTY_STATE } from './replacers';

/**
 * Removes deprecated empty-state properties from template (html) files and
 * updates attributes correspondingly (see ./replacers).
 */
export function updateEmptyStates(): Rule {
  return (tree: Tree, _: SchematicContext) => {
    const htmlFiles = getMatchingFilesFromTree(tree, (filePath) =>
      filePath.endsWith('.html'),
    );

    // Updates deprecated attributes
    for (const file of htmlFiles) {
      let content = readFileFromTree(tree, file);
      TO_REPLACE_EMPTY_STATE.forEach((toReplace) => {
        if (content.includes(toReplace.from)) {
          content = content.split(toReplace.from).join(toReplace.to);
        }
      });
      tree.overwrite(file, content);
    }
  };
}
