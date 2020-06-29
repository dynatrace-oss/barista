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
  Input,
  NgZone,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { DtTimeChangeEvent, DtTimeInput } from './timeinput';

@Component({
  selector: 'dt-timepicker',
  templateUrl: 'timepicker.html',
  styleUrls: ['timepicker.scss'],
  host: {
    class: 'dt-timepicker',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtTimepicker {
  /** Label used for displaying the date in range mode. */
  @Input()
  valueLabel: string;

  /** Contains the hour value that is depicted in the timeInput component */
  @Input()
  hour: number | null;

  /** Contains the minute value that is depicted in the timeInput component */
  @Input()
  minute: number | null;

  /**
   * @internal
   * Property used for enabling the time range mode.
   */
  _isTimeRangeEnabled = false;

  /** Binding for the disabled state. */
  @Input()
  get disabled(): boolean {
    return this._isDisabled;
  }
  set disabled(disabled: boolean) {
    this._isDisabled = coerceBooleanProperty(disabled);
    this._changeDetectorRef.markForCheck();
  }
  private _isDisabled: boolean = false;

  /** @internal Reference to the timeInput component */
  @ViewChild(DtTimeInput) _timeInput: DtTimeInput;

  /** Provides an event when the time input has changed */
  @Output()
  timeChange: Observable<DtTimeChangeEvent>;

  constructor(
    private _zone: NgZone,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.timeChange = this._zone.onMicrotaskEmpty.pipe(
      take(1),
      switchMap(() => this._timeInput.timeChange.asObservable()),
    );
  }
}
