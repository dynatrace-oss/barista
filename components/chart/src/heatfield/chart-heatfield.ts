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
import { ENTER } from '@angular/cdk/keycodes';
import { CdkConnectedOverlay, ConnectedPosition } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  CanColor,
  Constructor,
  isDefined,
  mixinColor,
  _readKeyCode,
} from '@dynatrace/barista-components/core';
import { clamp, round } from 'lodash';
import { Subject } from 'rxjs';
import { PlotBackgroundInfo } from '../utils';

const DT_HEATFIELD_TOP_OFFSET = 16;

const DT_HEATFIELD_OVERLAY_POSITIONS: ConnectedPosition[] = [
  {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
    offsetY: -8,
  },
  {
    originX: 'end',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'top',
    offsetX: 8,
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top',
    offsetX: -8,
  },
];

/** Event object emitted by DtOption when selected or deselected. */
export class DtChartHeatfieldActiveChange {
  constructor(
    /** Reference to the heatfield that emitted the event. */
    public source: DtChartHeatfield,
  ) {}
}

export type DtChartHeatfieldThemePalette = 'main' | 'error';

// Boilerplate for applying mixins to DtHeatfield.
export class DtHeatfieldBase {
  constructor(public _elementRef: ElementRef) {}
}
export const _DtHeatfieldMixinBase = mixinColor<
  Constructor<DtHeatfieldBase>,
  DtChartHeatfieldThemePalette
>(DtHeatfieldBase, 'error');

@Component({
  selector: 'dt-chart-heatfield',
  templateUrl: 'chart-heatfield.html',
  styleUrls: ['chart-heatfield.scss'],
  exportAs: 'dtChartHeatfield',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.Emulated,
  inputs: ['color'],
})
export class DtChartHeatfield extends _DtHeatfieldMixinBase
  implements CanColor<DtChartHeatfieldThemePalette>, OnDestroy {
  /** Event emitted when the option is selected or deselected. */
  @Output() readonly activeChange = new EventEmitter<
    DtChartHeatfieldActiveChange
  >();

  private _start: number;

  /** Start on the xAxis of the chart for the heatfield */
  @Input()
  get start(): number {
    return this._start;
  }
  set start(val: number) {
    if (this._start !== val) {
      this._start = val;
      this._updatePosition();
    }
  }

  private _end: number;

  /** End on the xAxis of the chart for the heatfield */
  @Input()
  get end(): number {
    return this._end;
  }
  set end(val: number) {
    if (this._end !== val) {
      this._end = val;
      this._updatePosition();
    }
  }

  private _active = false;

  /** Wether the heatfield is currently active */
  @Input()
  get active(): boolean {
    return this._active;
  }
  set active(val: boolean) {
    const coercedValue = coerceBooleanProperty(val);
    if (this._active !== coercedValue) {
      this._active = coercedValue;
      this.activeChange.next(new DtChartHeatfieldActiveChange(this));
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Provide an aria-label for better accessibility. */
  @Input('aria-label') ariaLabel: string;
  /** Aria reference to a label for better accessibility. */
  @Input('aria-labelledby') ariaLabelledBy: string;

  /**
   * @internal
   * BoundingBox of the Highcharts plotBackground is
   * set by the chart via the `_initHeatfield` function that
   * is called by the chart.
   * Is used to set the height of the heatfield backdrop.
   */
  _boundingBox: PlotBackgroundInfo;

  /**
   * Positions for the overlay that gets created
   * @internal
   */
  _positions: ConnectedPosition[] = DT_HEATFIELD_OVERLAY_POSITIONS;

  /**
   * Wether the input is a valid range. Input range is valid as long there is a
   * start value given. If there is a distinct end value given, it needs to be
   * larger than the start.
   * @internal
   */
  get _isValidStartEndRange(): boolean {
    const isValidEnd = isDefined(this.end) ? this.start < this.end : true;
    return isDefined(this.start) && isValidEnd;
  }

  /** @internal The backdrop that is positioned behind the chart */
  @ViewChild('backdrop', { read: ElementRef, static: true })
  _backdrop: ElementRef;

  /** @internal The marker button used to activate the heatfield */
  @ViewChild('marker', { read: ElementRef, static: true }) _marker: ElementRef;

  /** @internal The reference to the overlay. */
  @ViewChild(CdkConnectedOverlay)
  _overlay: CdkConnectedOverlay;

  private _destroy$ = new Subject<void>();
  private _relativeBoundingBox: { top: number; left: number; width: number };

  /**
   * Highcharts charts object is needed for the xAxis is
   * set by the chart via the `_initHeatfield` function that
   * is called by the chart.
   */
  private _chartObject: Highcharts.ChartObject;

  constructor(
    elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    super(elementRef);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * @internal
   * Initializes the heatfield with the provided bounding box of the chart
   * and the Highcharts chartObject that is needed to calculate the position
   */
  _initHeatfield(
    boundingBox: PlotBackgroundInfo,
    chartObject: Highcharts.ChartObject,
  ): void {
    this._boundingBox = boundingBox;
    this._chartObject = chartObject;

    this._updatePosition();
    if (this._overlay.overlayRef) {
      this._overlay.overlayRef.updatePosition();
    }
  }

  /**
   * Toggles the active state
   * @internal
   */
  _toggleActive(): void {
    this.active = !this.active;
  }

  /**
   * Keydown handler
   * @internal
   */
  _handleKeydown(event: KeyboardEvent): void {
    if (_readKeyCode(event) === ENTER) {
      this._toggleActive();
    }
  }

  /** Calculates and updates the position for the heatfield */
  private _updatePosition(): void {
    if (this._isValidStartEndRange && this._chartObject && this._boundingBox) {
      const xAxis = this._chartObject.xAxis;
      if (xAxis && xAxis.length > 0) {
        // NOTE that there can be multiple xAxis in highcharts but our charts don't have multiple xAxis
        // so we use the first one for the extremes
        const extremes = xAxis[0].getExtremes();
        const pxPerUnit =
          this._boundingBox.width / (extremes.max - extremes.min);
        const left =
          (clamp(this._start, extremes.min, extremes.max) - extremes.min) *
          pxPerUnit;
        // calculate the width based on start/end values or from start to the edge of the chart
        const width = isDefined(this._end)
          ? (clamp(this._end, extremes.min, extremes.max) - extremes.min) *
              pxPerUnit -
            left
          : (extremes.max - extremes.min) * pxPerUnit - left;
        // tslint:disable:no-magic-numbers
        this._relativeBoundingBox = {
          left: round(left + this._boundingBox.left, 2),
          width: round(width, 2),
          top: round(this._boundingBox.top - DT_HEATFIELD_TOP_OFFSET, 2),
        };
        // tslint:enable:no-magic-numbers
        // It is not possible to set this on the ref nativelement and not in the marker and the backdrop,
        // because we need to have the backdrop behind the chart and the marker in front.
        this._updateMarkerPosition();
        this._updateBackdropPosition();
      }
    }
  }

  /** Update marker position */
  private _updateMarkerPosition(): void {
    this._marker.nativeElement.style.left = `${this._relativeBoundingBox.left}px`;
    this._marker.nativeElement.style.width = `${this._relativeBoundingBox.width}px`;
  }

  /** Update backdrop position */
  private _updateBackdropPosition(): void {
    if (this._backdrop) {
      this._backdrop.nativeElement.style.left = `${this._relativeBoundingBox.left}px`;
      this._backdrop.nativeElement.style.width = `${this._relativeBoundingBox.width}px`;
      this._backdrop.nativeElement.style.top = `${DT_HEATFIELD_TOP_OFFSET}px`;
    }
  }
}
