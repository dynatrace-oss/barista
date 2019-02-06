
import { Component, ElementRef, ChangeDetectionStrategy, Output, EventEmitter, ViewEncapsulation, AfterViewInit, ChangeDetectorRef, OnDestroy, InjectionToken, Inject, ContentChildren, QueryList, AfterContentInit, ViewChildren } from '@angular/core';
import { DtViewportResizer, Constructor, mixinColor, CanColor } from '@dynatrace/angular-components/core';
import { takeUntil, startWith } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
import { DtMicroChartConfig } from './micro-chart-config';
import { DtMicroChartSeries } from './public-api';
import { DtMicroChartSeriesInternal } from './series';

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

  @ContentChildren(DtMicroChartSeries) _allSeriesExternal: QueryList<DtMicroChartSeries>;
  @ViewChildren(DtMicroChartSeriesInternal) _allSeriesInternal: QueryList<DtMicroChartSeriesInternal>;

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

  constructor(
    _elementRef: ElementRef<HTMLElement>,
    private _viewportResizer: DtViewportResizer,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(DT_MICRO_CHART_DEFAULT_OPTIONS) private _config: DtMicroChartConfig
  ) {
    super(_elementRef);
    if (this._viewportResizer) {
      this._viewportResizer.change()
        .pipe(takeUntil(this._destroy))
        .subscribe(() => {
          this._reflow();
        });
    }
  }

  ngAfterViewInit(): void {
    this._allSeriesInternal.forEach((series) => {
      series._config = this._config;
    });
    // We need to do this in the next cycle since we need to wait for the dom
    // to update and have the correct sizes on the nativeelement in the ref
    Promise.resolve().then(() => {
      this._reflow();
    });
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  private _reflow(): void {
    this._width = this._elementRef.nativeElement.getBoundingClientRect().width;
    this._allSeriesInternal.forEach((series) => series._reflow(this._width));
    this._changeDetectorRef.markForCheck();
  }
}
