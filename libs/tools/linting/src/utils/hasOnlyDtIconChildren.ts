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

import {
  ElementAst,
  EmbeddedTemplateAst,
  TemplateAst,
  TextAst,
} from '@angular/compiler';

import { hasTextContent } from './hasContent';
import { isElementWithName } from './isElementWithName';

/**
 * Filters whitespace text elements.
 * @param element - the current element.
 * @returns false if the element is a text node and contains only whitespace characters.
 */
function filterWhitespaceElements(element: TemplateAst): boolean {
  if (element instanceof TextAst) {
    return hasTextContent(element);
  }
  return true;
}

/**
 * Checks if all child nodes are dt-icon elements.
 * @param element - the current element.
 * @returns whether the element contains only dt-icon elements.
 */
export function hasOnlyDtIconChildren(element: ElementAst): boolean {
  return element.children
    .filter(child => filterWhitespaceElements(child))
    .every(child => {
      if (isElementWithName(child, 'dt-icon')) {
        return true;
      }

      if (child instanceof EmbeddedTemplateAst) {
        return child.children.every(grandchild =>
          isElementWithName(grandchild, 'dt-icon'),
        );
      }

      return false;
    });
}
