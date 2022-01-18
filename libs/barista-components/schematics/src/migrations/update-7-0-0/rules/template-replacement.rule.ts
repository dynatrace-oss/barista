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

import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { getMatchingFilesFromTree } from '../../../utils';

type Replacer = (fileContent: string) => string;

/** @internal Interface that is used for the list of template Replacements */
export interface TemplateReplacementList {
  /** The needle is the string that should be searched in the template */
  needle: string;
  /** Function to replace the needle in the template or plain string for replacement */
  replacement: Replacer | string;
}

/**
 * @internal
 * Creates the template replacement rule to update all html templates.
 */
export function templateReplacementRule(
  replacements: TemplateReplacementList[],
): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    if (replacements.length === 0) {
      context.logger.info(
        'No Replacements specified for the template Replacement Rule!',
      );
      return;
    }

    const htmlFiles = Array.from(
      getMatchingFilesFromTree(tree, (filePath) => filePath.endsWith('.html')),
    );

    // A for loop with predefined length is the most preforming way to loop over large arrays
    for (let i = 0, max = htmlFiles.length; i < max; i++) {
      let fileContent = tree.read(htmlFiles[i])?.toString();

      if (!fileContent) {
        continue;
      }

      for (let r = 0, rmax = replacements.length; r < rmax; r++) {
        const { replacement, needle } = replacements[r];
        // indexOf is the fastest string includes check
        if (fileContent.indexOf(needle) < 0) {
          continue;
        }

        if (typeof replacement === 'string') {
          fileContent = fileContent.replace(
            new RegExp(needle, 'gm'),
            replacement,
          );
          continue;
        }

        fileContent = replacement(fileContent);
      }

      context.logger.info(`Updated File: ${htmlFiles[i]}`);
      // After all replacements where done overwrite file
      tree.overwrite(htmlFiles[i], fileContent);
    }
  };
}
