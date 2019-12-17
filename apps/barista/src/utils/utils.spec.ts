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

import { wrapCodeLines } from './wrap-code-lines';
import { createInputElement } from './create-input-element';

describe('Barista app utils', () => {
  it('wrapCodeLines', () => {
    const code = `const name = 'Hermann';
function hello() {
  console.log('Hello' + name + '!');
}`;

    const wrappedCode = wrapCodeLines(code, 'ba-code-line');
    expect(wrappedCode).toMatchSnapshot();
  });

  it('createInputElement', () => {
    const createdInputElement = createInputElement(
      'Text that should be copied!',
      'input',
    );
    expect(createdInputElement).toBeInstanceOf(HTMLInputElement);
    expect(createdInputElement.value).toBe('Text that should be copied!');
  });

  it('createTextAreaElement', () => {
    const createdInputElement = createInputElement(
      'Text that should be copied!',
      'textarea',
    );
    expect(createdInputElement).toBeInstanceOf(HTMLTextAreaElement);
    expect(createdInputElement.value).toBe('Text that should be copied!');
  });
});
