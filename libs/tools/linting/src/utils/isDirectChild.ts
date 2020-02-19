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

import { ElementAst, EmbeddedTemplateAst } from '@angular/compiler';

import { isElementWithName } from './isElementWithName';

/**
 * Checks if the given element has a child element with the given name.
 * If directives (like *ngIf) are set, the element's child becomes an EmbeddedTemplateAst
 * and the name of the element can be found when looking at its children.
 * @param element - The parent element.
 * @param childName - The name of the child element.
 * @returns Whether the child element could be found or not.
 */
export function isDirectChild(element: ElementAst, childName: string): boolean {
  const isChild = element.children.some(child =>
    isElementWithName(child, childName),
  );

  if (isChild) {
    return true;
  }

  return element.children.some(child => {
    if (child instanceof EmbeddedTemplateAst) {
      return child.children.some(grandchild =>
        isElementWithName(grandchild, childName),
      );
    }
    return false;
  });
}
