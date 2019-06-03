import { ENTER } from '@angular/cdk/keycodes';
import { CdkConnectedOverlay, ConnectedPosition } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Inject, Input, OnDestroy, Output, SkipSelf, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { CanColor, isDefined, mixinColor, readKeyCode, Constructor } from '@dynatrace/angular-components/core';
import { clamp, round } from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DtChart } from '../chart';
import { getDtHeatfieldUnsupportedChartError } from './chart-heatfield-errors';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

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
    public source: DtChartHeatfield
  ) { }
}

export type DtChartHeatfieldThemePalette = 'main' | 'error';

// Boilerplate for applying mixins to DtHeatfield.
export class DtHeatfieldBase {
  constructor(public _elementRef: ElementRef) { }
}
export const _DtHeatfieldMixinBase =
  mixinColor<Constructor<DtHeatfieldBase>, DtChartHeatfieldThemePalette>(DtHeatfieldBase, 'error');

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
  implements CanColor<DtChartHeatfieldThemePalette>, OnDestroy, AfterViewInit {

  /** Event emitted when the option is selected or deselected. */
  @Output() readonly activeChange = new EventEmitter<DtChartHeatfieldActiveChange>();

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

  @Input('aria-label') ariaLabel: string;

  private _destroyed = new Subject<void>();
  private _relativeBoundingBox: { top: number; left: number; width: number };

  /**
   * Positions for the overlay that gets created
   * @internal
   */
  _positions: ConnectedPosition[] = DT_HEATFIELD_OVERLAY_POSITIONS;

  /**
   * Boundingbox of the plot background - used for calculations and positioning
   * @internal
   */
  _plotBackgroundBoundingBox: { left: number; top: number; width: number; height: number };

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

  /** The backdrop that is positioned behind the chart */
  @ViewChild('backdrop', { read: ElementRef }) _backdrop: ElementRef;

  /** The marker button used to activate the heatfield */
  @ViewChild('marker', { read: ElementRef }) _marker: ElementRef;

  @ViewChild(CdkConnectedOverlay) _overlay: CdkConnectedOverlay;

  constructor(
    elementRef: ElementRef,
    @Inject(forwardRef(() => DtChart)) @SkipSelf() private _chart: DtChart,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    super(elementRef);
    this._checkChartSupport();
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  ngAfterViewInit(): void {
    this._chart._afterRender
    .pipe(takeUntil(this._destroyed))
    .subscribe(() => {
      this._checkChartSupport();
      this._getPlotBackgroundBoundingBox();
      this._updatePosition();
      if (this._overlay.overlayRef) {
        this._overlay.overlayRef.updatePosition();
      }
    });
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
    if (readKeyCode(event) === ENTER) {
      this._toggleActive();
    }
  }

  /** Apply boundaries to the host element ref to match the chart */
  private _getPlotBackgroundBoundingBox(): void {
    // this needs to be run after zone is stable because we need to wait until the origin is actually rendered
    // to get the correct boundaries
    const plotBackground = this._chart && this._chart.container.nativeElement.querySelector('.highcharts-plot-background');
    if (plotBackground) {
      this._plotBackgroundBoundingBox = {
        width: parseInt(plotBackground.getAttribute('width'), 10),
        height: parseInt(plotBackground.getAttribute('height'), 10),
        left: parseInt(plotBackground.getAttribute('x'), 10),
        top: parseInt(plotBackground.getAttribute('y'), 10),
      };
    }
  }

  /** Calculates and updates the position for the heatfield */
  private _updatePosition(): void {
    if (this._isValidStartEndRange && this._chart._chartObject && this._plotBackgroundBoundingBox) {
      const xAxis = this._chart._chartObject.xAxis;
      if (xAxis && xAxis.length > 0) {
        // NOTE that there can be multiple xAxis in highcharts but our charts dont have multiple xAxis
        // so we use the first one for the extremes
        const extremes = xAxis[0].getExtremes();
        const pxPerUnit = this._plotBackgroundBoundingBox.width / (extremes.max - extremes.min);
        const left = (clamp(this._start, extremes.min, extremes.max) - extremes.min) * pxPerUnit;
        // calculate the width based on start/end values or from start to the edge of the chart
        const width = isDefined(this._end) ?
          (clamp(this._end, extremes.min, extremes.max) - extremes.min) * pxPerUnit - left :
          (extremes.max - extremes.min) * pxPerUnit - left;
        // tslint:disable:no-magic-numbers
        this._relativeBoundingBox = {
          left: round(left + this._plotBackgroundBoundingBox.left, 2),
          width: round(width, 2),
          top: round(this._plotBackgroundBoundingBox.top - DT_HEATFIELD_TOP_OFFSET, 2),
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

  private _checkChartSupport(): void {
    if (
      this._chart &&
      this._chart.options &&
      this._chart.options.xAxis &&
      this._chart.options.xAxis[0] &&
      this._chart.options.xAxis[0].categories
    ) {
      throw getDtHeatfieldUnsupportedChartError();
    }
  }
}
