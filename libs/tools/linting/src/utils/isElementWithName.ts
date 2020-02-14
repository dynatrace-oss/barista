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

import { ElementAst, TemplateAst } from '@angular/compiler';

/**
 * Checks if given element is of type ElementAst and has the given name.
 *
 * @param element - The element to check
 * @param names – The name(s) to check for
 */
export function isElementWithName(
  element: TemplateAst,
  ...names: string[] // tslint:disable-line:trailing-comma
): boolean {
  return element instanceof ElementAst && names.includes(element.name);
}
