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
  selector: 'component-barista-example',
  template: `
    <dt-tag-list>
      <dt-tag
        [removable]="canRemove"
        [value]="value1"
        (removed)="doRemove(tag1)"
        #tag1
        title="My custom tooltip"
      >
        <dt-tag-key *ngIf="hasKey">[AWS]OSType:</dt-tag-key>
        Windows
      </dt-tag>
      <dt-tag
        [removable]="canRemove"
        [value]="value2"
        (removed)="doRemove(tag2)"
        #tag2
        title="Another tooltip"
      >
        <dt-tag-key *ngIf="hasKey">[AWS]Category:</dt-tag-key>
        Managed
      </dt-tag>
    </dt-tag-list>
    <button
      dt-button
      (click)="canRemove = !canRemove"
      [variant]="canRemove ? 'primary' : 'secondary'"
    >
      Toggle removable
    </button>
    <button
      dt-button
      (click)="hasKey = !hasKey"
      [variant]="hasKey ? 'primary' : 'secondary'"
    >
      Toggle key
    </button>
  `,
})
export class TagInteractiveExample {
  value1 = 'My value 1';
  value2 = 'My value 2';
  canRemove = false;
  hasKey = false;

  doRemove(tag: DtTag<string>): void {
    window.alert(`Tag removed: ${tag.value}`);
  }
}
