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

import { AttrAst, ElementAst } from '@angular/compiler';

export function isIconButtonAttr(attr: AttrAst): boolean {
  return attr.name === 'dt-icon-button';
}

export function isButtonAttr(attr: AttrAst): boolean {
  return attr.name === 'dt-button';
}

export function isButtonElement(element: ElementAst): boolean {
  const elementName = element.name;
  if (elementName !== 'button' && elementName !== 'a') {
    return false;
  }

  if (
    elementName === 'a' &&
    !element.attrs.some(attr => isButtonAttr(attr) || isIconButtonAttr(attr))
  ) {
    return false;
  }

  return true;
}
