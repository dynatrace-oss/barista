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

import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HasId, mixinId } from '@dynatrace/barista-components/core';

/**
 * Boilerplate for mixin extension of ExpandableText
 */
export class DtExpandableTextBase {
  constructor() {}
}
export const _ExpandableTextBase = mixinId(
  DtExpandableTextBase,
  'dt-expandable-text',
);

/**
 * Provides basic expand/collaps functionality for
 * inline-text without any styling.
 */
@Component({
  selector: 'dt-expandable-text',
  exportAs: 'dtExpandableText',
  templateUrl: 'expandable-text.html',
  styleUrls: ['expandable-text.scss'],
  host: {
    class: 'dt-expandable-text',
    '[class.dt-expandable-text-expanded]': 'expanded',
  },
  inputs: ['id'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtExpandableText extends _ExpandableTextBase implements HasId {
  /** Label for the expand button */
  @Input() label: string;
  /** Label for the collapse button */
  @Input() labelClose: string;

  /** Whether the text is expanded */
  @Input()
  get expanded(): boolean {
    return this._expanded;
  }
  set expanded(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    if (this._expanded !== newValue) {
      this._expanded = newValue;
      this._changeDetectorRef.markForCheck();
    }
  }
  private _expanded = false;
  static ngAcceptInputType_expanded: BooleanInput;

  /** Event emitted when state changes */
  @Output() readonly expandChanged = new EventEmitter<boolean>();

  /** @internal Event emitted when text is expanded */
  // eslint-disable-next-line
  @Output('expanded')
  readonly _textExpanded: Observable<boolean> = this.expandChanged.pipe(
    filter((v) => v),
  );

  /** @internal Event emitted when text is collapsed */
  // eslint-disable-next-line
  @Output('collapsed')
  readonly _textCollapsed: Observable<boolean> = this.expandChanged.pipe(
    filter((v) => !v),
  );

  constructor(private _changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  /** Toggles the expandable text state */
  toggle(): void {
    if (this.expanded) {
      this.close();
    } else {
      this.open();
    }
  }

  /** Closes the expandable text */
  close(): void {
    this.expanded = false;
    this.expandChanged.emit(this.expanded);
  }

  /** Opens the expandable text */
  open(): void {
    this.expanded = true;
    this.expandChanged.emit(this.expanded);
  }
}
