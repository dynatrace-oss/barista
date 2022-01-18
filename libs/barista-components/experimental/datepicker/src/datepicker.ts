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
  animateChild,
  group,
  query,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  CdkConnectedOverlay,
  Overlay,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Self,
  SkipSelf,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm,
} from '@angular/forms';
import {
  CanDisable,
  DtDateAdapter,
  DtOverlayThemingConfiguration,
  dtSetOverlayThemeAttribute,
  dtSetUiTestAttribute,
  DtUiTestConfiguration,
  DT_OVERLAY_THEMING_CONFIG,
  DT_UI_TEST_CONFIG,
  HasTabIndex,
  mixinDisabled,
  mixinTabIndex,
} from '@dynatrace/barista-components/core';
import { DtTheme } from '@dynatrace/barista-components/theming';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DtCalendar } from './calendar';
import { getValidDateOrNull } from './datepicker-utils/util';
import { DtTimeChangeEvent } from './timeinput';
import { DtTimepicker } from './timepicker';
import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';

/**
 * This position config ensures that the top "start" corner of the overlay
 * is aligned with with the top "start" of the origin by default (overlapping
 * the trigger completely). If the panel cannot fit below the trigger, it
 * will fall back to a position above the trigger.
 */
const OVERLAY_POSITIONS = [
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
  },
  {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
    offsetX: 2,
  },
  {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetX: 2,
  },
];

let uniqueId = 0;

// Boilerplate for applying mixins to DtDatePicker.
export class DtDatepickerBase {
  constructor(
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl,
  ) {}
}
export const _DtDatepickerBase = mixinTabIndex(mixinDisabled(DtDatepickerBase));

@Component({
  selector: 'dt-datepicker',
  templateUrl: 'datepicker.html',
  styleUrls: ['datepicker.scss'],
  host: {
    class: 'dt-datepicker',
    '[attr.id]': 'id',
    '[attr.aria-disabled]': 'disabled.toString()',
  },
  inputs: ['disabled', 'tabIndex'],
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('transformPanel', [
      state(
        'void',
        style({
          transform: 'scaleY(0) translateX(-1px)',
          opacity: 0,
        }),
      ),
      state(
        'showing',
        style({
          opacity: 1,
          transform: 'scaleY(1) translateX(-1px)',
        }),
      ),
      transition(
        'void => *',
        group([
          query('@fadeInContent', animateChild()),
          animate('150ms cubic-bezier(0.25, 0.8, 0.25, 1)'),
        ]),
      ),
      transition('* => void', [
        animate('250ms 100ms linear', style({ opacity: 0 })),
      ]),
    ]),
    trigger('fadeInContent', [
      state('showing', style({ opacity: 1 })),
      transition('void => showing', [
        style({ opacity: 0 }),
        animate('150ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
      ]),
    ]),
  ],
})
export class DtDatePicker<T>
  extends _DtDatepickerBase
  implements ControlValueAccessor, CanDisable, HasTabIndex, OnDestroy
{
  /** Unique id of the element. */
  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
  }
  private _id: string;
  private _uid = `dt-datepicker-${uniqueId++}`;

  /** Value of the datepicker control. */
  @Input()
  get value(): T | null {
    return this._value;
  }
  set value(newValue: T | null) {
    if (newValue !== this._value) {
      this._value = newValue;
      this._changeDetectorRef.markForCheck();
    }
  }
  private _value: T | null = null;

  /** The date to open the calendar to initially. */
  @Input()
  get startAt(): T | null {
    return this._value || this._startAt;
  }
  set startAt(value: T | null) {
    this._startAt = getValidDateOrNull(this._dateAdapter, value);
  }
  private _startAt: T | null;

  /** Classes to be passed to the datepicker panel. Supports the same syntax as `ngClass`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() panelClass: string | string[] | Set<string> | { [key: string]: any };

  /** Property that enables the timepicker, so that a time can be entered as well. */
  @Input()
  get isTimeEnabled(): boolean {
    return this._isTimeEnabled;
  }
  set isTimeEnabled(value: boolean) {
    this._isTimeEnabled = coerceBooleanProperty(value);
  }
  private _isTimeEnabled = false;
  static ngAcceptInputType_isTimeEnabled: BooleanInput;

  /** Property decides whether or not the today button should be shown. */
  @Input()
  get showTodayButton(): boolean {
    return this._showTodayButton;
  }
  set showTodayButton(value: boolean) {
    this._showTodayButton = coerceBooleanProperty(value);
  }
  private _showTodayButton = false;
  static ngAcceptInputType_showTodayButton: BooleanInput;

  /** Whether or not the overlay panel is open. */
  get panelOpen(): boolean {
    return this._panelOpen;
  }
  private _panelOpen = false;

  /** Overlay pane containing the options. */
  @ViewChild(CdkConnectedOverlay) _overlayDir: CdkConnectedOverlay;

  @ViewChild(DtCalendar) _calendar: DtCalendar<T>;

  @ViewChild(DtTimepicker) _timePicker: DtTimepicker;

  @ViewChild('panel') _panel: ElementRef;

  /** @internal Property that enables the range mode. */
  _isRangeEnabled: boolean;

  /** @internal Defines the positions the overlay can take relative to the button element. */
  _positions = OVERLAY_POSITIONS;

  /** @internal Defines the scrolling strategy of the overlay. */
  _scrollStrategy: ScrollStrategy;

  /** @internal Whether the panel's animation is done. */
  _panelDoneAnimating = false;

  /** @internal Hour */
  get hour(): number | null {
    return this._hour === 0 ? null : this._hour;
  }

  private _hour: number | null;

  /** @internal Minute */
  get minute(): number | null {
    return this._minute === 0 ? null : this._minute;
  }

  private _minute: number | null;

  /** @internal `View -> model callback called when value changes` */
  _onChange: (value: Date) => void = () => {};

  /** @internal `View -> model callback called when datepicker has been touched` */
  _onTouched = () => {};

  /**
   * @internal Label used for displaying the date.
   */
  get valueLabel(): string {
    return this._valueLabel || 'Select date';
  }
  set valueLabel(value: string) {
    this._valueLabel = value;
  }
  private _valueLabel = '';

  /**
   * @internal Label used for displaying the time.
   */
  _timeLabel = '';

  private _destroy$ = new Subject<void>();

  constructor(
    private _overlay: Overlay,
    private _dateAdapter: DtDateAdapter<T>,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _elementRef: ElementRef,
    @Optional() readonly parentForm: NgForm,
    @Optional() readonly parentFormGroup: FormGroupDirective,
    @Optional() @SkipSelf() private _theme: DtTheme,
    @Self() @Optional() readonly ngControl: NgControl,
    @Attribute('tabindex') tabIndex: string,
    @Optional()
    @Inject(DT_OVERLAY_THEMING_CONFIG)
    private readonly _themeConfig: DtOverlayThemingConfiguration,
    @Optional()
    @Inject(DT_UI_TEST_CONFIG)
    private readonly _config?: DtUiTestConfiguration,
  ) {
    super(parentForm, parentFormGroup, ngControl);

    this.tabIndex = parseInt(tabIndex, 10) || 0;

    // Force setter to be called in case id was not specified.
    // eslint-disable-next-line no-self-assign
    this.id = this.id;
  }

  ngOnInit(): void {
    this._valueLabel = this.value
      ? this._dateAdapter.format(this.value, {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })
      : 'Select date';
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** Opens or closes the overlay panel. */
  toggle(): void {
    if (this.panelOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /** Opens the overlay panel. */
  open(): void {
    if (!this.disabled && !this._panelOpen) {
      this._scrollStrategy = this._overlay.scrollStrategies.block();
      this._panelOpen = true;
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Closes the overlay panel and focuses the host element. */
  close(): void {
    if (this._panelOpen) {
      this._panelOpen = false;
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Sets the datepicker's value. Part of the ControlValueAccessor. */
  writeValue(value: T | null): void {
    this.value = value;
  }

  /**
   * Saves a callback function to be invoked when the datepicker's value
   * changes from user input. Part of the ControlValueAccessor.
   */
  registerOnChange(fn: (value: Date) => void): void {
    this._onChange = fn;
  }

  /**
   * Saves a callback function to be invoked when the datepicker is blurred
   * by the user. Part of the ControlValueAccessor.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  /** Disables the datepicker. Part of the ControlValueAccessor. */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
  }

  /** @internal Callback that is invoked when the overlay panel has been attached. */
  _onAttached(): void {
    dtSetUiTestAttribute(
      this._overlayDir.overlayRef.overlayElement,
      this._overlayDir.overlayRef.overlayElement.id,
      this._elementRef,
      this._config,
    );
  }

  /**
   * @internal
   * When the panel content is done fading in, the _panelDoneAnimating property is
   * set so the proper class can be added to the panel.
   */
  _onFadeInDone(): void {
    this._panelDoneAnimating = this.panelOpen;

    if (this.panelOpen) {
      if (this.isTimeEnabled) {
        this._handleTimepickerValues();
        this._timePicker._timeInput._hourInput.nativeElement.focus();
      } else {
        this._calendar.focus();
      }
    }

    this._changeDetectorRef.markForCheck();
  }

  /**
   * @internal Handle timepicker hour and minute values.
   */
  _handleTimepickerValues(): void {
    this._timePicker.timeChange
      .pipe(takeUntil(this._destroy$))
      .subscribe((changed) => {
        this._handleTimeInputChange(changed);
      });

    this._timePicker._timeInput.hour = this.hour;
    this._timePicker._timeInput.minute = this.minute;
  }

  /**
   * @internal Add a theming class to the overlay only when dark mode is enabled
   */
  _onFadeInStart(): void {
    if (this.panelOpen && this._theme && this._theme.variant === 'dark')
      dtSetOverlayThemeAttribute(
        this._panel.nativeElement,
        this._elementRef.nativeElement,
        this._themeConfig,
      );
  }

  /**
   * @internal Set the selected date.
   */
  _setSelectedValue(value: T): void {
    if (this.value === value) {
      return;
    }

    this._value = value;
    this._valueLabel = value
      ? this._dateAdapter.format(value, {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })
      : 'Select date';
    this._changeDetectorRef.markForCheck();
  }

  /**
   * @internal Handle the new values when there are time changes.
   */
  _handleTimeInputChange(event: DtTimeChangeEvent): void {
    if (!event) {
      return;
    }

    this._hour = event?.hour || 0;
    this._minute = event?.minute || 0;
    this._timeLabel = event?.format();
  }

  /**
   * @internal Handle the new values when there are time changes.
   */
  _isTimeLabelAvailable(): boolean {
    return this.isTimeEnabled && (this._hour !== 0 || this._minute !== 0);
  }
}
