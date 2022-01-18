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

import { FocusMonitor } from '@angular/cdk/a11y';
import { CdkStepHeader, StepState } from '@angular/cdk/stepper';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';

import { DtStepLabel } from './step-label';
import {
  coerceNumberProperty,
  NumberInput,
  coerceBooleanProperty,
  BooleanInput,
} from '@angular/cdk/coercion';

@Component({
  selector: 'dt-step-header',
  templateUrl: 'step-header.html',
  styleUrls: ['step-header.scss'],
  host: {
    class: 'dt-step-header',
    role: 'tab',
    '[class.dt-step-active]': 'active',
    '[class.dt-step-selected]': 'selected',
    '[class.dt-step-error]': 'state === "error"',
  },
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtStepHeader extends CdkStepHeader implements OnDestroy {
  /** State of the given step. */
  @Input() state: StepState;

  /** Label of the given step. */
  @Input() label: DtStepLabel | string;

  /** Index of the given step. */
  @Input()
  get index(): number {
    return this._index;
  }
  set index(value: number) {
    this._index = coerceNumberProperty(value);
  }
  private _index: number;
  static ngAcceptInputType_index: NumberInput;

  /** Whether the given step is selected. */
  @Input()
  get selected(): boolean {
    return this._selected;
  }
  set selected(value: boolean) {
    this._selected = coerceBooleanProperty(value);
  }
  private _selected: boolean;
  static ngAcceptInputType_selected: BooleanInput;

  /** Whether the given step label is active. */
  @Input()
  get active(): boolean {
    return this._active;
  }
  set active(value: boolean) {
    this._active = coerceBooleanProperty(value);
  }
  private _active: boolean;
  static ngAcceptInputType_active: BooleanInput;

  constructor(
    private readonly _focusMonitor: FocusMonitor,
    readonly _elementRef: ElementRef<HTMLElement>,
  ) {
    super(_elementRef);
    this._focusMonitor.monitor(this._elementRef, true);
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  /** Focuses the step header. */
  focus(): void {
    this._focusMonitor.focusVia(this._elementRef, 'program');
  }

  /** @internal Returns string label of given step if it is a text label. */
  _stringLabel(): string | null {
    return this.label instanceof DtStepLabel ? null : this.label;
  }

  /** @internal Returns DtStepLabel if the label of given step is a template label. */
  _templateLabel(): DtStepLabel | null {
    return this.label instanceof DtStepLabel ? this.label : null;
  }
}
