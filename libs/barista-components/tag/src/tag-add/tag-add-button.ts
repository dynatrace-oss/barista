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

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dt-tag-add-button',
  template: `
    <button
      class="dt-tag-add-submit-button"
      dt-button
      (click)="handleClick($event)"
      [disabled]="!this.valid"
      i18n
    >
      Add
    </button>
  `,
})
export class DtTagAddButton {
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() readonly click = new EventEmitter<Event>();

  @Input() valid: boolean;

  handleClick(event: Event): void {
    this.click.emit(event);
  }
}
