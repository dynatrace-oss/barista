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

import { replaceHtmlAttribute } from './replace-html-attribute';

test('should replace an attribute on a html element', () => {
  const content = `<dt-breadcrumb aria-label-close="Close the selection"></dt-breadcrumb>`;
  const replaced = replaceHtmlAttribute(
    'aria-label-close',
    'ariaLabelClose',
    ['dt-breadcrumb'],
    content,
  );
  expect(replaced).toMatchInlineSnapshot(
    `"<dt-breadcrumb ariaLabelClose=\\"Close the selection\\"></dt-breadcrumb>"`,
  );
});

test('should replace an attribute with a binding', () => {
  const content = `<dt-breadcrumb [aria-label-close]="'Close the selection'"></dt-breadcrumb>`;
  const replaced = replaceHtmlAttribute(
    'aria-label-close',
    'ariaLabelClose',
    ['dt-breadcrumb'],
    content,
  );
  expect(replaced).toMatchInlineSnapshot(
    `"<dt-breadcrumb [ariaLabelClose]=\\"'Close the selection'\\"></dt-breadcrumb>"`,
  );
});

test('should replace an attribute on a html element with different quotes', () => {
  const content = `<dt-breadcrumb aria-label-close='Close the selection'></dt-breadcrumb>`;
  const replaced = replaceHtmlAttribute(
    'aria-label-close',
    'ariaLabelClose',
    ['dt-breadcrumb'],
    content,
  );
  expect(replaced).toMatchInlineSnapshot(
    `"<dt-breadcrumb ariaLabelClose='Close the selection'></dt-breadcrumb>"`,
  );
});

test('should not replace anything if the attribute is only a part of another attribute', () => {
  const content = `<dt-breadcrumb aria-label-close-button="Close the selection"></dt-breadcrumb>`;
  const replaced = replaceHtmlAttribute(
    'aria-label-close',
    'ariaLabelClose',
    ['dt-breadcrumb'],
    content,
  );
  expect(replaced).toMatch(content);
});

test('should not replace anything if the attribute is not on the specified element', () => {
  const content = `<dt-breadcrumb aria-label-close="Close the selection"></dt-breadcrumb>`;
  const replaced = replaceHtmlAttribute(
    'aria-label-close',
    'ariaLabelClose',
    ['dt-label'],
    content,
  );
  expect(replaced).toMatch(content);
});

test('should replace the attribute in a multiline style', () => {
  const content = `
    <dt-breadcrumb
      aria-label="some label"
      (click)="clicked()"
      aria-label-close-button="
        Close the selection
      "
    ></dt-breadcrumb>`;
  const replaced = replaceHtmlAttribute(
    'aria-label-close-button',
    'ariaLabelCloseButton',
    ['dt-breadcrumb'],
    content,
  );
  expect(replaced).toMatchInlineSnapshot(`
    "
        <dt-breadcrumb
          aria-label=\\"some label\\"
          (click)=\\"clicked()\\"
          ariaLabelCloseButton=\\"
            Close the selection
          \\"
        ></dt-breadcrumb>"
  `);
});
