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

/**
 * Applies the table heading text to every table definition element
 * as a data attribute. This attribute is used to display the title
 * on small screen where no header is present.
 */
export function applyTableDefinitionHeadingAttr(table: HTMLTableElement): void {
  let th = [].slice.call(table.querySelectorAll('th'));
  if (!th.length) {
    th = [].slice.call(table.querySelectorAll('thead td'));
  }
  const header = th.map((el) => el.textContent);
  const tr = table.querySelectorAll('tr');
  tr.forEach((row) => {
    const td = row.querySelectorAll('td');
    td.forEach((cell, i) => cell.setAttribute('data-th', header[i]));
  });
}
