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

/**
 * Creates a non-visible input element (input field or textarea)
 * with the given string as value.
 */
export function createInputElement(
  value: string,
  type: 'textarea' | 'input',
): HTMLTextAreaElement | HTMLInputElement {
  const input = document.createElement(type);
  input.style.position = 'absolute';
  input.style.right = '0';
  input.style.left = '0';
  input.style.padding = '0';
  input.style.border = 'none';
  input.style.background = 'transparent';
  input.style.width = '1px';
  input.style.height = '1px';
  input.value = value;
  return input;
}
