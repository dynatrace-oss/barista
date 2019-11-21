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

import { DtTag } from '@dynatrace/barista-components/tag';

@Component({
  selector: 'dt-example-tag-interactive',
  templateUrl: './tag-interactive-example.html',
})
export class DtExampleTagInteractive {
  value1 = 'My value 1';
  value2 = 'My value 2';
  canRemove = false;
  hasKey = false;

  doRemove(tag: DtTag<string>): void {
    window.alert(`Tag removed: ${tag.value}`);
  }
}
