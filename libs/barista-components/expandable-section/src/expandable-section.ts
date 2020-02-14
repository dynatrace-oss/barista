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

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CanDisable } from '@dynatrace/barista-components/core';
import { DtExpandablePanel } from '@dynatrace/barista-components/expandable-panel';
import { filter } from 'rxjs/operators';

@Directive({
  exportAs: 'dtExpandableSectionHeader',
  selector: 'dt-expandable-section-header',
})
export class DtExpandableSectionHeader {}

@Component({
  selector: 'dt-expandable-section',
  exportAs: 'dtExpandableSection',
  templateUrl: 'expandable-section.html',
  styleUrls: ['expandable-section.scss'],
  host: {
    class: 'dt-expandable-section',
    '[class.dt-expandable-section-opened]': 'expanded',
    '[class.dt-expandable-section-disabled]': 'disabled',
    '[attr.aria-disabled]': 'disabled',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtExpandableSection implements CanDisable, OnChanges {
  /** Whether the expandable section is expanded. */
  @Input()
  get expanded(): boolean {
    return this._panel.expanded;
  }
  set expanded(value: boolean) {
    this._panel.expanded = coerceBooleanProperty(value);
    this._changeDetectorRef.markForCheck();
  }

  /** Whether the expandable section is disabled. */
  @Input()
  get disabled(): boolean {
    return Boolean(this._panel?.disabled);
  }
  set disabled(value: boolean) {
    if (this._panel) {
      this._panel.disabled = coerceBooleanProperty(value);
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Event emitted when the section's expandable state changes. */
  @Output() readonly expandChange = new EventEmitter<boolean>();

  /** @internal Event emitted when the section is expanded. */
  @Output('expanded') readonly _sectionExpanded = this.expandChange.pipe(
    filter(v => v),
  );

  /** @internal Event emitted when the section is collapsed. */
  @Output('collapsed') readonly _sectionCollapsed = this.expandChange.pipe(
    filter(v => !v),
  );

  @ViewChild(DtExpandablePanel, { static: true })
  private _panel: DtExpandablePanel;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.disabled?.firstChange) {
      this._panel.disabled = this.disabled;
    }
  }

  /**
   * Toggles the expanded state of the panel.
   */
  toggle(): void {
    if (!this.disabled) {
      this._panel.toggle();
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Sets the expanded state of the panel to false. */
  close(): void {
    this._panel.close();
    this._changeDetectorRef.markForCheck();
  }

  /** Sets the expanded state of the panel to true. */
  open(): void {
    if (!this.disabled) {
      this._panel.open();
      this._changeDetectorRef.markForCheck();
    }
  }
}
