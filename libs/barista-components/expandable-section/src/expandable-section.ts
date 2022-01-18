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
  Directive,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CanDisable, HasId, mixinId } from '@dynatrace/barista-components/core';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Directive({
  exportAs: 'dtExpandableSectionHeader',
  selector: 'dt-expandable-section-header, [dtExpandableSectionHeader]',
})
export class DtExpandableSectionHeader {}

/**
 * Boilerplate for mixin extension of ExpandableSection
 */
export class DtExpandableSectionBase {
  constructor() {}
}
export const _ExpandableSectionBase = mixinId(
  DtExpandableSectionBase,
  'dt-expandable-section',
);

@Component({
  selector: 'dt-expandable-section',
  exportAs: 'dtExpandableSection',
  templateUrl: 'expandable-section.html',
  styleUrls: ['expandable-section.scss'],
  host: {
    class: 'dt-expandable-section',
    '[class.dt-expandable-section-opened]': 'expanded',
    '[class.dt-expandable-section-closed]': '!expanded',
    '[class.dt-expandable-section-disabled]': 'disabled',
    '[attr.aria-disabled]': 'disabled',
  },
  inputs: ['id'],
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtExpandableSection
  extends _ExpandableSectionBase
  implements CanDisable, HasId
{
  /** Whether the expandable section is expanded. */
  @Input()
  get expanded(): boolean {
    return !this.disabled && this._expanded;
  }
  set expanded(value: boolean) {
    this._expanded = coerceBooleanProperty(value);
    this._changeDetectorRef.markForCheck();
  }
  private _expanded = false;
  static ngAcceptInputType_expanded: BooleanInput;

  /** Whether the expandable section is disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._changeDetectorRef.markForCheck();
  }
  private _disabled = false;
  static ngAcceptInputType_disabled: BooleanInput;

  /** Event emitted when the section's expandable state changes. */
  @Output() readonly expandChange = new EventEmitter<boolean>();

  /** @internal Event emitted when the section is expanded. */
  @Output('expanded')
  readonly _sectionExpanded: Observable<boolean> = this.expandChange.pipe(
    filter((v) => v),
  );

  /** @internal Event emitted when the section is collapsed. */
  @Output('collapsed')
  readonly _sectionCollapsed: Observable<boolean> = this.expandChange.pipe(
    filter((v) => !v),
  );

  constructor(private _changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  /**
   * Toggles the expanded state of the panel.
   */
  toggle(): void {
    if (!this.disabled) {
      if (this._expanded) {
        this.close();
      } else {
        this.open();
      }
    }
  }

  /** Sets the expanded state of the panel to false. */
  close(): void {
    this._expanded = false;
    this._changeDetectorRef.markForCheck();
  }

  /** Sets the expanded state of the panel to true. */
  open(): void {
    if (!this.disabled) {
      this._expanded = true;
      this._changeDetectorRef.markForCheck();
    }
  }

  _panelExpandChange(value: boolean): void {
    this._expanded = value;
    this.expandChange.next(value);
    this._changeDetectorRef.markForCheck();
  }
}
