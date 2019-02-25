
import { Component, ElementRef, ChangeDetectionStrategy, ViewEncapsulation, AfterViewInit, ChangeDetectorRef, OnDestroy, InjectionToken, Inject, ContentChildren, QueryList, ViewChildren, Renderer2, NgZone } from '@angular/core';
import { DtViewportResizer, Constructor, mixinColor, CanColor, isDefined } from '@dynatrace/angular-components/core';
import { takeUntil, switchMap, startWith, filter, map, take } from 'rxjs/operators';
import { Subject, combineLatest, merge, defer } from 'rxjs';
import { DtMicroChartConfig } from './micro-chart-config';
import { DtMicroChartSeries, DtMicroChartBarSeries, DtMicroChartColumnSeries, DtMicroChartSeriesType } from './public-api';
import { DtMicroChartSeriesSVG } from './series';
import { handleChartData } from './business-logic/core/chart';
import { DT_MICRO_CHART_RENDERER, DtMicroChartRenderer } from './business-logic/renderer/base';
import { DtMicroChartSvgRenderer, DtMicroChartLineSeriesSvgData, DtMicroChartColumnSeriesSvgData } from './business-logic/renderer/svg-renderer';

/** Injection token that can be used to specify default micro-chart options. */
export const DT_MICRO_CHART_DEFAULT_OPTIONS =
    new InjectionToken<DtMicroChartConfig>(
      'dt-micro-chart-default-options',
      { providedIn: 'root', factory: DT_MICRO_CHART_DEFAULT_OPTIONS_FACTORY_V2 });

export function DT_MICRO_CHART_DEFAULT_OPTIONS_FACTORY_V2(): DtMicroChartConfig {
  return new DtMicroChartConfig();
}

export type DtMicroChartThemePaletteV2 = 'main';

// Boilerplate for applying mixins to DtMicroChart
export class DtMicroChartBaseV2 { constructor(public _elementRef: ElementRef) { } }
export const _DtMicroChartBaseV2 =
  mixinColor<Constructor<DtMicroChartBaseV2>, DtMicroChartThemePaletteV2>(DtMicroChartBaseV2, 'main');

@Component({
  selector: 'dt-micro-chart-v2',
  templateUrl: './micro-chart-v2.html',
  styleUrls: ['./micro-chart-v2.scss'],
  inputs: ['color'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtMicroChartV2 extends _DtMicroChartBaseV2 implements CanColor<DtMicroChartThemePaletteV2>, AfterViewInit, OnDestroy {

  private readonly _destroy = new Subject<void>();

  // TODO: check for new or removed children -> maybe subscribe and trigger CD
  @ContentChildren(DtMicroChartSeries) _allSeriesExternal: QueryList<DtMicroChartSeries>;
  @ViewChildren(DtMicroChartSeriesSVG) _allSeriesSVG: QueryList<DtMicroChartSeriesSVG>;

  get _viewbox(): string {
    return `0 0 ${this._width} ${this._config.height}`;
  }

  private _width = 0;
  get _widthWithPixels(): string {
    return `${this._width}px`;
  }

  get _plotAreaTransform(): string {
    return `translate(${this._config.marginLeft},${this._config.marginTop})`;
  }

  _renderData = new Subject<Array<DtMicroChartLineSeriesSvgData | DtMicroChartColumnSeriesSvgData>>();

  constructor(
    _elementRef: ElementRef<HTMLElement>,
    private _viewportResizer: DtViewportResizer,
    private _changeDetectorRef: ChangeDetectorRef,
    private _zone: NgZone,
    @Inject(DT_MICRO_CHART_RENDERER) private _chartRenderer: DtMicroChartSvgRenderer,
    @Inject(DT_MICRO_CHART_DEFAULT_OPTIONS) private _config: DtMicroChartConfig
  ) {
    super(_elementRef);
  }

  ngAfterViewInit(): void {
    this._allSeriesSVG.forEach((series) => {
      series._config = this._config;
    });

    // Promise.resolve().then(() => { this._updateChart(); });

    // this is a stream that emits everytime one of the series' input changes
    const seriesInputChanges = this._allSeriesExternal.changes.pipe(
      startWith(null),
      filter(() => !!this._allSeriesExternal.length),
      switchMap(() => combineLatest(...this._allSeriesExternal.map((seriesExt) => seriesExt._stateChanges))),
      // TODO figure it out - prevent multiple emissions when data changes
      // switchMap((series) => this._zone.onMicrotaskEmpty.pipe(take(1), map(() => series)))
    );

    const viewportChanges = this._viewportResizer.change().pipe(
      startWith(null),
      map(() => (this._elementRef.nativeElement as HTMLElement).getBoundingClientRect().width));

    // we merge the seriesInputChanges with the viewport resizer changes to
    // trigger recalculation of the scales and domains and reflow
    combineLatest(viewportChanges, seriesInputChanges).pipe(
      takeUntil(this._destroy),
    ).subscribe(([width, series]) => {
      Promise.resolve().then(() => {
        this._width = width;
        const transformedData = handleChartData(width, series, this._config);
        this._renderData.next(transformedData.map(
          (data) => {
            switch (data.type) {
              case 'column':
                return this._chartRenderer.createColumnSeriesRenderData(data);
              case 'bar':
                return this._chartRenderer.createBarSeriesRenderData(data);
              case 'line':
              default:
                return this._chartRenderer.createLineSeriesRenderData(data);
            }
          }));
        this._changeDetectorRef.markForCheck();
      });
    });
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }
}

// export function extractDataFromSeries(series: DtMicroChartSeries[]): Array<{ type: DtMicroChartSeriesType; data: number[]; }> {
//   return series.map((s) => {
//     switch(s.type) {
//       case 'line':
//       default:
//         return { type: s.type, data: s.data };
//     }
//   });
// }
