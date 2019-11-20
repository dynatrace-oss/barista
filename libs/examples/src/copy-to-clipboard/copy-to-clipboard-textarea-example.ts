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

import { Component } from '@angular/core';

@Component({
  selector: 'barista-demo',
  template: `
    <dt-copy-to-clipboard>
      <!-- prettier-ignore -->
      <textarea dtInput aria-label="The text content of the textarea will be copied to clipboard." rows="8">
buildscript {
  repositories {
    jcenter()
  }
  dependencies {
    classpath 'com.dynatrace.tools:android:7.2.+'
  }
}
      </textarea>
      <dt-copy-to-clipboard-label>Copy</dt-copy-to-clipboard-label>
    </dt-copy-to-clipboard>
  `,
})
export class CopyToClipboardTextareaExample {}
