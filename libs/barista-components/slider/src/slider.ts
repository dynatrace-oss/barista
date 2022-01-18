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
  coerceBooleanProperty,
  coerceNumberProperty,
  NumberInput,
  BooleanInput,
} from '@angular/cdk/coercion';
import {
  DOWN_ARROW,
  END,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import { Platform } from '@angular/cdk/platform';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  clamp,
  isDefined,
  roundToDecimal,
} from '@dynatrace/barista-components/core';
import { DtInput } from '@dynatrace/barista-components/input';
import {
  animationFrameScheduler,
  BehaviorSubject,
  fromEvent,
  merge,
  Observable,
  of,
  Subject,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  observeOn,
  share,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';
import {
  getKeyCodeValue,
  getSliderPositionBasedOnValue,
  getSliderValueForCoordinate,
  roundToSnap,
} from './slider-utils';

/** We need unique ids in order to have correct labeling. */
let uniqueId = 0;

const KEY_CODES_ARRAY: Array<number> = [
  LEFT_ARROW,
  DOWN_ARROW,
  RIGHT_ARROW,
  UP_ARROW,
  HOME,
  END,
  PAGE_UP,
  PAGE_DOWN,
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any;

@Component({
  selector: 'dt-slider',
  templateUrl: 'slider.html',
  styleUrls: ['slider.scss'],
  host: {
    class: 'dt-slider',
  },
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtSlider',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtSlider implements AfterViewInit, OnDestroy, OnInit {
  /**
   * Binding for the minimum value of the slider.
   */
  @Input()
  get min(): number {
    return this._min;
  }
  set min(min: number) {
    if (isDefined(min)) {
      this._min = coerceNumberProperty(min);
      if (this._min > this._value) {
        this._updateValue(this._min, true);
      } else {
        this._updateSliderPosition(this._value, this._min, this._max);
      }
    }
  }
  private _min = 0;
  static ngAcceptInputType_min: NumberInput;

  /**
   * Binding for the maximum value of the slider.
   */
  @Input()
  get max(): number {
    return this._max;
  }
  set max(max: number) {
    if (isDefined(max)) {
      this._max = coerceNumberProperty(max);
      if (this._max < this._value) {
        this._updateValue(this._max, true);
      } else {
        this._updateSliderPosition(this._value, this._min, this._max);
      }
    }
  }
  private _max = 10;
  static ngAcceptInputType_max: NumberInput;

  /**
   * Bindings for the step, if changed, roundShift needs to be recalculated.
   */
  @Input()
  get step(): number {
    return this._step;
  }
  set step(step: number) {
    if (isDefined(step)) {
      this._step = coerceNumberProperty(step);
    }

    this._roundShift = 0;
    // deal with rounding problems.
    let countingStep = this._step;

    while (countingStep % 1 !== 0) {
      countingStep *= 10;
      this._roundShift++;
    }
  }
  /** Holds the value of step internally */
  private _step = 1;
  static ngAcceptInputType_step: NumberInput;

  /** Binding for the disabled state. */
  @Input()
  get disabled(): boolean {
    return this._isDisabled;
  }
  set disabled(disabled: boolean) {
    if (isDefined(disabled)) {
      this._isDisabled = coerceBooleanProperty(disabled);
      this._changeDetectorRef.markForCheck();
    }
  }
  private _isDisabled = false;
  static ngAcceptInputType_disabled: BooleanInput;

  /**
   * The binding for the value of the slider.
   */
  @Input()
  get value(): number {
    return this._value;
  }
  set value(value: number) {
    if (isDefined(value)) {
      this._updateValue(coerceNumberProperty(value));
    }
  }
  private _value = 0;
  static ngAcceptInputType_value: NumberInput;

  /** Provides event for value change */
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change = new EventEmitter<number>();

  /** @internal Holds the track wrapper */
  @ViewChild('trackWrapper', { static: true })
  _trackWrapper: ElementRef<HTMLDivElement>;

  /** @internal Holds the thumb */
  @ViewChild('thumb', { static: true })
  _thumb: ElementRef<HTMLDivElement>;

  /** @internal Holds the slider fill */
  @ViewChild('sliderFill', { static: true })
  _sliderFill: ElementRef<HTMLDivElement>;

  /** @internal Holds the slider background */
  @ViewChild('sliderBackground', { static: true })
  _sliderBackground: ElementRef<HTMLDivElement>;

  /** @internal Holds the slider input field */
  @ViewChild(DtInput, { static: true })
  _sliderInput: DtInput;

  /** @internal Unique id for this input. */
  _labelUid = `dt-slider-label-${uniqueId++}`;

  /**
   * Holds the value, the rounding is shifted with.
   * Calculated based in the step, to avoid JS rounding problems.
   */
  private _roundShift = 0;
  /** Holds the value of the slider. */
  private _value$ = new BehaviorSubject<number>(0);
  /** Holds the description of the size of the slider. */
  private _clientRect$: Observable<ClientRect>;
  /** Observer that gets triggered if the slider is resized on the screen. */
  private _resizeObserver$ = new Subject<void>();
  /** Variable to hold the ResizeObserver */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _observer: any;
  /** Observer that gets triggered if the input field value is changed. */
  private _inputFieldValue$ = new Subject<number>();
  /** Observer that completes on ngOnDestroy */
  private _destroy$ = new Subject<void>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _zone: NgZone,
    private _platform: Platform,
  ) {}

  ngOnInit(): void {
    const initValue = roundToSnap(this.value, this.step, this._min, this._max);
    if (this._value$.value !== initValue) {
      this._updateValue(initValue);
    }
  }

  ngAfterViewInit(): void {
    if (this._platform.isBrowser && 'ResizeObserver' in window) {
      this._observer = new window.ResizeObserver(() => {
        this._resizeObserver$.next();
      });

      this._observer.observe(this._trackWrapper.nativeElement);
    }

    this._clientRect$ = merge(
      this._resizeObserver$.pipe(debounceTime(50)),
      of(null), // at least one initial trigger is needed
    ).pipe(map(() => this._trackWrapper.nativeElement.getBoundingClientRect()));

    this._zone.runOutsideAngular(() => {
      this._captureEvents();
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    if (this._platform.isBrowser && this._observer) {
      this._observer.disconnect();
    }
  }

  /**
   * @internal
   * Convert input string value to number and call
   * roundToSnap takes care of snapping the values to the steps
   */
  _inputValueChanged(event: Event): void {
    event.stopPropagation();
    this._inputFieldValue$.next(
      +(event.currentTarget as HTMLInputElement).value,
    );
  }

  /** Updates the value if the update is triggered by the consumer. */
  private _updateValue(value: number, userTriggered: boolean = true): void {
    this._value = value;
    // We only need to update if the update is coming from outside the component.
    if (userTriggered) {
      this._value$.next(roundToSnap(value, this.step, this._min, this._max));
    }
  }

  /** Updates The slider based on the new value */
  private _updateSlider(value: number): void {
    this._updateInput(value);
    this._updateValue(value, false);
    this._updateSliderPosition(value, this._min, this._max);
    this.change.emit(value);
    this._changeDetectorRef.markForCheck();
  }

  /** Updates the input field with new value. */
  private _updateInput(value: number): void {
    this._sliderInput.value = value.toString();
  }

  /** Update the slider thumb position based on value, min and max. */
  private _updateSliderPosition(value: number, min: number, max: number): void {
    const position: number = getSliderPositionBasedOnValue({ value, min, max });
    this._thumb.nativeElement.style.transform = `translateX(-${
      100 - position * 100
    }%)`;
    this._sliderFill.nativeElement.style.transform = `scale3d(${position}, 1, 1)`;
    this._sliderBackground.nativeElement.style.transform = `scale3d(${
      1 - position
    }, 1, 1)`;
  }

  /**
   * Capture user events, and implement necessary streams to update view.
   */
  private _captureEvents(): void {
    if (!this._platform.isBrowser) {
      // early exit if env is not browser
      return;
    }

    const start$ = merge(
      fromEvent(this._trackWrapper.nativeElement, 'mousedown'),
      fromEvent(this._trackWrapper.nativeElement, 'touchstart'),
    );

    const move$ = merge(
      fromEvent<MouseEvent>(window, 'mousemove').pipe(
        map((mouseEvent) => mouseEvent.clientX),
      ),
      fromEvent<TouchEvent>(window, 'touchmove').pipe(
        map((touchEvent) => touchEvent.changedTouches[0].clientX),
      ),
    );

    const moveEnd$ = merge(
      fromEvent(window, 'mouseup'),
      fromEvent(window, 'touchend'),
    );

    /** Combining the start, move and moveEnd observers concludes the drag observer. */
    const drag$ = start$.pipe(
      switchMap(() =>
        move$.pipe(
          distinctUntilChanged(),
          observeOn(animationFrameScheduler),
          takeUntil(moveEnd$),
        ),
      ),
      share(),
    );

    const click$ = fromEvent<MouseEvent>(
      this._trackWrapper.nativeElement,
      'click',
    ).pipe(map((mouseEvent) => mouseEvent.clientX));

    // stream from keyboard events
    const keyDown$ = fromEvent<KeyboardEvent>(
      this._trackWrapper.nativeElement,
      'keydown',
    ).pipe(
      filter((keyboardEvent) =>
        KEY_CODES_ARRAY.includes(keyboardEvent.keyCode),
      ),
      map((keyboardEvent) => {
        keyboardEvent.stopPropagation(); // global angular keydown would trigger CD.
        keyboardEvent.preventDefault();
        const valueAddition = getKeyCodeValue(
          this._max,
          this.step,
          keyboardEvent.keyCode,
        );
        const rounded = roundToDecimal(
          this._value + valueAddition,
          this._roundShift,
        );
        return clamp(rounded, this._min, this._max);
      }),
      distinctUntilChanged(),
    );

    // triggered by drag and click
    const mouse$ = merge(drag$, click$).pipe(
      withLatestFrom(this._clientRect$),
      map(([coordinate, { left, width }]) => {
        const newValue = getSliderValueForCoordinate({
          coordinate,
          offset: left,
          width,
          min: this._min,
          max: this._max,
          step: this.step,
          roundShift: this._roundShift,
        });
        return newValue;
      }),
      distinctUntilChanged(),
    );

    const inputValue$ = this._inputFieldValue$.pipe(
      /**
       * distinctUntilChanged() purposefully left out, to round the value
       * and update the input field with the rounded value
       */
      map((value) => roundToSnap(value, this.step, this._min, this._max)),
    );

    merge(this._value$, inputValue$, mouse$, keyDown$)
      .pipe(
        filter(() => !this._isDisabled),
        takeUntil(this._destroy$),
      )
      .subscribe((value) => {
        this._zone.run(() => this._updateSlider(value));
      });
  }
}

/**
 * The main label for the slider.
 *
 * @example
 *   <dt-slider [value]="1" [min]="0" [max]="10" [step]="1">
 *     <dt-slider-label>label</dt-slider-label>
 *   </dt-slider>
 */
@Directive({
  selector: `dt-slider-label, [dt-slider-label], [dtSliderLabel]`,
  exportAs: 'dtSliderLabel',
  host: {
    class: 'dt-slider-label',
  },
})
export class DtSliderLabel {}

/**
 * The label for the unit of the slider.
 *
 * @example
 *   <dt-slider [value]="1" [min]="0" [max]="10" [step]="1">
 *     <dt-slider-unit>units</dt-slider-unit>
 *   </dt-slider>
 */
@Directive({
  selector: `dt-slider-unit, [dt-slider-unit], [dtSliderUnit]`,
  exportAs: 'dtSliderUnit',
  host: {
    class: 'dt-slider-unit',
  },
})
export class DtSliderUnit {}
