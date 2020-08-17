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

import './components/metadata-upload-confirm';

/**
 * Shows a confirmation dialogue for style metadata upload.
 * @returns A Promise that resolves to true or false according to the option selected by the user.
 */
export function showMetadataUploadConfirmDialog(): Promise<boolean> {
  const confirmComponent = showUIComponent('metadata-upload-confirmation');

  return new Promise((resolve) => {
    confirmComponent.addEventListener('confirm', () => resolve(true), {
      once: true,
    });
    confirmComponent.addEventListener('cancel', () => resolve(false), {
      once: true,
    });
  });
}

/** @internal Attaches an element with the given name to the body. */
function showUIComponent(elementName: string): HTMLElement {
  const element = document.createElement(elementName);
  document.body.appendChild(element);
  return element;
}
