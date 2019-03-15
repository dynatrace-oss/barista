
import {
  Component,
  ElementRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
  InjectionToken,
  Inject,
  ContentChildren,
  QueryList,
  ViewChildren,
  NgZone,
} from '@angular/core';
import { DtViewportResizer, Constructor, mixinColor, CanColor } from '@dynatrace/angular-components/core';
import { takeUntil, switchMap, startWith, filter, map } from 'rxjs/operators';
import { Subject, combineLatest, of, iif, merge } from 'rxjs';
import { DtMicroChartConfig } from './micro-chart-config';
import { DtMicroChartSeries, DtMicroChartAxis, DtMicroChartXAxis, DtMicroChartYAxis, DtMicroChartColumnSeries, DtMicroChartStackContainer, DtMicroChartBarSeries } from './public-api';
import { DtMicroChartSeriesSVG } from './series';
import { createChartDomains, DtMicroChartSeriesData, DtMicroChartIdentification, applyAxesExtentsToDomain } from './business-logic/core/chart';
import { DT_MICRO_CHART_RENDERER } from './business-logic/renderer/base';
import { DtMicroChartSvgRenderer, DtMicroChartLineSeriesSvgData, DtMicroChartColumnSeriesSvgData, DtMicroChartRendererSeriesData } from './business-logic/renderer/svg-renderer';
import { handleChartLineSeries } from './business-logic/core/line';
import { handleChartBarSeries } from './business-logic/core/bar';
import { handleChartColumnSeries } from './business-logic/core/column';
import { createStack, extendDomainForStack } from './business-logic/core/stacks';
import { Series } from 'd3-shape';

/** Injection token that can be used to specify default micro-chart options. */
export const DT_MICRO_CHART_DEFAULT_OPTIONS =
    new InjectionToken<DtMicroChartConfig>(
      'dt-micro-chart-default-options',
      { providedIn: 'root', factory: DT_MICRO_CHART_DEFAULT_OPTIONS_FACTORY2 });

export function DT_MICRO_CHART_DEFAULT_OPTIONS_FACTORY2(): DtMicroChartConfig {
  return new DtMicroChartConfig();
}

export type DtMicroChartThemePalette2 = 'main';

// Boilerplate for applying mixins to DtMicroChart
export class DtMicroChartBase2 { constructor(public _elementRef: ElementRef) { } }
export const _DtMicroChartBase2 =
  mixinColor<Constructor<DtMicroChartBase2>, DtMicroChartThemePalette2>(DtMicroChartBase2, 'main');

@Component({
  selector: 'dt-micro-chart2',
  templateUrl: './micro-chart2.html',
  styleUrls: ['./micro-chart2.scss'],
  inputs: ['color'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtMicroChart2 extends _DtMicroChartBase2 implements CanColor<DtMicroChartThemePalette2>, AfterViewInit, OnDestroy {

  /** @internal Destroy subject to clear subscriptions on component destroy. */
  private readonly _destroy = new Subject<void>();

  /** Width of the micro-chart2 container. */
  private _width = 0;

  // TODO: check for new or removed children -> maybe subscribe and trigger CD
  /** @internal A QueryList of all public series configured by the consumer. */
  @ContentChildren(DtMicroChartSeries, { descendants: true }) _allSeriesExternal: QueryList<DtMicroChartSeries>;

  /** @internal A QueryList of all public x-axis configure by the consumer. */
  @ContentChildren(DtMicroChartXAxis) _allXAxesExternal: QueryList<DtMicroChartXAxis>;

  /** @internal A QueryList of all public y-axis configure by the consumer. */
  @ContentChildren(DtMicroChartYAxis) _allYAxesExternal: QueryList<DtMicroChartYAxis>;

  /** @internal A QueryList of all rendered internal series. */
  @ViewChildren(DtMicroChartSeriesSVG) _allSeriesSVG: QueryList<DtMicroChartSeriesSVG>;

  @ContentChildren(DtMicroChartStackContainer) _stackContainer: QueryList<DtMicroChartStackContainer>;

  /** @internal Returns a viewbox string for the micro-chart2 svg container. */
  get _viewbox(): string {
    return `0 0 ${this._width} ${this._config.height}`;
  }

  /** @internal Conversion getter to trnasform width from number into a pixel valued string. */
  get _widthWithPixels(): string {
    return `${this._width}px`;
  }

  /** @internal Calculates the translation string to move the plot area to apply configured margin. */
  get _plotAreaTransform(): string {
    return `translate(${this._config.marginLeft},${this._config.marginTop})`;
  }

  /** @internal Subject containing all relevant render data to pass to the template/renderer. */
  _renderData = new Subject<DtMicroChartRendererSeriesData[]>();

  constructor(
    _elementRef: ElementRef<HTMLElement>,
    private _viewportResizer: DtViewportResizer,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(DT_MICRO_CHART_RENDERER) private _chartRenderer: DtMicroChartSvgRenderer,
    @Inject(DT_MICRO_CHART_DEFAULT_OPTIONS) private _config: DtMicroChartConfig
  ) {
    super(_elementRef);
  }

  /** After view init hook. */
  ngAfterViewInit(): void {
    // iterate through all series and apply the config.
    // do we need this or could we pass this as a binding with the render data?
    this._allSeriesSVG.forEach((series) => {
      series._config = this._config;
    });

    // This is a stream that emits everytime one of the series' input changes.
    const seriesInputChanges = this._allSeriesExternal.changes.pipe(
      startWith(null),
      filter(() => !!this._allSeriesExternal.length),
      switchMap(() => combineLatest(...this._allSeriesExternal.map((seriesExt) => seriesExt._stateChanges)))
      // TODO: figure it out - prevent multiple emissions when data changes
      // switchMap((series) => this._zone.onMicrotaskEmpty.pipe(take(1), map(() => series)))
    );

    // This is a stream that emits every time one of the x axes' inputs change.
    const xAxesInputChanges = this._allXAxesExternal.changes.pipe(
      startWith(null),
      switchMap((a) => {
        if (!!this._allXAxesExternal.length) {
          return combineLatest(...this._allXAxesExternal.map((axisExt) => axisExt._stateChanges));
        }
        return of(null);
      })
    );

    // This is a stream that emits every time one of the x axes' inputs change.
    const yAxesInputChanges = this._allYAxesExternal.changes.pipe(
      startWith(null),
      switchMap((a) => {
        if (!!this._allYAxesExternal.length) {
          return combineLatest(...this._allYAxesExternal.map((axisExt) => axisExt._stateChanges));
        }
        return of(null);
      })
    );

    // This is a stream that emits every time the viewport size changes and applies the new width of the chart.
    const viewportChanges = this._viewportResizer.change().pipe(
      startWith(null),
      map(() => (this._elementRef.nativeElement as HTMLElement).getBoundingClientRect().width));

    // we merge the seriesInputChanges with the viewport resizer changes to
    // trigger recalculation of the scales and domains and reflow
    combineLatest(
      viewportChanges,
      seriesInputChanges,
      xAxesInputChanges,
      yAxesInputChanges
    ).pipe(
      takeUntil(this._destroy)
    ).subscribe(([width, series, xAxes, yAxes]) => {
      Promise.resolve().then(() => {
        // apply the new width.
        this._width = width;

        // generate Domains for all series.
        let domains = createChartDomains(series);

        // Get extents of the axis.
        if (xAxes !== null || yAxes !== null) {
          domains = applyAxesExtentsToDomain([...(xAxes || []), ...(yAxes || [])], domains);
        }

        let stack: Array<Series<{ [key: string]: number }, string>> | undefined;
        if (this._stackContainer.length > 0) {
          stack = createStack(series);
          domains = extendDomainForStack(domains, stack);
        }
        // for now we can only have one stack

        const nextRenderData: DtMicroChartRendererSeriesData[] = [];

        // iterate over the series and collect renderdata.
        for (const s of series) {
          let rendererData;
          switch (s.type) {
            case 'column': {
              const data = handleChartColumnSeries(width, (s as DtMicroChartColumnSeries), domains, this._config, stack);
              rendererData = this._chartRenderer.createColumnSeriesRenderData(data);
              break;
            }
            case 'bar': {
              const data = handleChartBarSeries(width, (s as DtMicroChartBarSeries), domains, this._config, stack);
              rendererData = this._chartRenderer.createBarSeriesRenderData(data);
              break;
            }
            case 'line':
            default: {
              const data = handleChartLineSeries(width, s._transformedData, domains, this._config);
              rendererData = this._chartRenderer.createLineSeriesRenderData(data);
            }
          }
          nextRenderData.push({ ...s._renderData, ...rendererData, width, plotOffsetX: this._config.marginLeft });
        }
        this._renderData.next(nextRenderData);
        this._changeDetectorRef.markForCheck();
      });
    });
  }

  /** OnDestroy hook. */
  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }
}
