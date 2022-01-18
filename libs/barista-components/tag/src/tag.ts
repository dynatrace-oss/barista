/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

/** Key of a tag, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-tag-key, [dtTagKey]`,
  exportAs: 'dtTagKey',
  host: {
    class: 'tag-key',
  },
})
export class DtTagKey {}

@Component({
  selector: 'dt-tag, [dt-tag], [dtTag]',
  templateUrl: 'tag.html',
  styleUrls: ['tag.scss'],
  host: {
    class: 'dt-tag',
    role: 'listitem',
    '[class.dt-tag-removable]': 'removable',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtTag<T> {
  /** Arbitrary value that represents this tag. */
  @Input() value?: T;

  /**
   * Decides whether the tag is removable by the user.
   */
  @Input()
  get removable(): boolean {
    return this._removable;
  }
  set removable(value: boolean) {
    this._removable = coerceBooleanProperty(value);
  }
  private _removable = false;
  static ngAcceptInputType_removable: BooleanInput;

  /** Emits events when the tag gets removed. */
  @Output()
  readonly removed: EventEmitter<T> = new EventEmitter<T>();

  /** @internal Emits an removed event if the tag is not disabled. */
  _removeTag(): void {
    this.removed.emit(this.value);
  }
}
