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

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
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
import { Observable, BehaviorSubject } from 'rxjs';
import { isDefined } from '@dynatrace/barista-components/core';

/**
 * UniqueId counter, will be incremented with every
 * instatiation of the ExpandablePanel class
 */
let uniqueId = 0;

@Component({
  selector: 'dt-expandable-panel',
  exportAs: 'dtExpandablePanel',
  templateUrl: 'expandable-panel.html',
  styleUrls: ['expandable-panel.scss'],
  host: {
    class: 'dt-expandable-panel',
    '[class.dt-expandable-panel-opened]': 'expanded',
    '[attr.aria-disabled]': 'disabled',
    '[attr.id]': 'id',
  },
  animations: [
    trigger('animationState', [
      state(
        'false',
        style({
          height: '0px',
          visibility: 'hidden',
        }),
      ),
      state(
        'true',
        style({
          height: '*',
          visibility: 'visible',
          overflow: 'visible',
        }),
      ),
      transition('true <=> false', [
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)'),
      ]),
    ]),
  ],
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtExpandablePanel {
  /** Assigns an id to the expandable panel. */
  @Input()
  get id(): string {
    return this._id.value;
  }
  set id(value: string) {
    if (isDefined(value)) {
      this._id.next(value);
    } else {
      this._id.next(`dt-expandable-panel-${uniqueId++}`);
    }
  }
  _id = new BehaviorSubject<string>(`dt-expandable-panel-${uniqueId++}`);

  /** Whether the panel is expanded. */
  @Input()
  get expanded(): boolean {
    return this._expanded;
  }
  set expanded(value: boolean) {
    const newValue = coerceBooleanProperty(value);

    // Only update expanded state if it actually changed.
    if (this._expanded !== newValue) {
      this._expanded = newValue;
      this.expandChange.emit(newValue);

      // Ensures that the animation will run when the value is set outside of an `@Input`.
      // This includes cases like the open, close and toggle methods.
      this._changeDetectorRef.markForCheck();
    }
  }
  private _expanded = false;
  static ngAcceptInputType_expanded: BooleanInput;

  /** Whether the panel is disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    // When panel gets disabled it will also close when expanded.
    if (this._disabled && this._expanded) {
      this._expanded = false;
    }
    this._changeDetectorRef.markForCheck();
  }
  private _disabled = false;
  static ngAcceptInputType_disabled: BooleanInput;

  /** Event emitted when the panel's expandable state changes. */
  @Output()
  readonly expandChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** @internal Event emitted when the panel is expanded. */
  @Output('expanded')
  readonly _panelExpanded: Observable<boolean> = this.expandChange.pipe(
    filter((v) => v),
  );

  /** @internal Event emitted when the panel is collapsed. */
  @Output('collapsed')
  readonly _panelCollapsed: Observable<boolean> = this.expandChange.pipe(
    filter((v) => !v),
  );

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  /**
   * Toggles the expanded state of the panel.
   */
  toggle(): void {
    if (!this._disabled) {
      this.expanded = !this.expanded;
    }
  }

  /** Sets the expanded state of the panel to false. */
  close(): void {
    if (!this._disabled) {
      this.expanded = false;
    }
  }

  /** Sets the expanded state of the panel to true. */
  open(): void {
    if (!this._disabled) {
      this.expanded = true;
    }
  }
}
