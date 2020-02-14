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

import { ElementAst, EmbeddedTemplateAst, TextAst } from '@angular/compiler';

/**
 * Check if element contains text apart from whitespace characters.
 * @param element – The element to check.
 */
export function hasTextContent(element: TextAst): boolean {
  const nonWhitespaceCharacters = element.value.match(/\S/g);
  if (nonWhitespaceCharacters !== null && nonWhitespaceCharacters.length > 1) {
    return true;
  }
  return false;
}

/**
 * Check if the element has any content. If children only contain text nodes
 * that only contain whitespace characters, this does not count as content.
 * @param element - The element to check.
 * @returns Whether the given element contains any content.
 */
export function hasContent(element: ElementAst | EmbeddedTemplateAst): boolean {
  if (!element.children) {
    return false;
  }

  return element.children.some(child => {
    if (child instanceof TextAst) {
      return hasTextContent(child);
    }
    return true;
  });
}

/**
 * Check if the element has any content (see above).
 * Child nodes whose name can be found in exclude do not count as content.
 * @param element - The element to check.
 * @param exclude - Array of node names that do not count as content.
 */
export function hasContentApartFrom(
  element: ElementAst,
  exclude: string[],
): boolean {
  if (!element.children) {
    return false;
  }

  return element.children.some(child => {
    if (child instanceof TextAst) {
      return hasTextContent(child);
    }

    if (child instanceof ElementAst && exclude.includes(child.name)) {
      return false;
    }

    return true;
  });
}
