// import { Component, Input, SkipSelf, Inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
// import { DtMicroChart, DT_MICRO_CHART_DEFAULT_OPTIONS } from '../micro-chart';
// import { DtMicroChartConfig } from '../micro-chart-config';
// import { Subscription } from 'rxjs';
// import { scaleBand, scaleLinear, ScaleBand, ScaleLinear } from 'd3-scale';
// import { getMinMaxValues } from '../helper-functions';

// @Component({
//   selector: 'g[dt-micro-chart-column-series]',
//   templateUrl: 'column.html',
//   styleUrls: ['column.scss'],
//   host: {
//     class: 'dt-micro-chart-series, dt-micro-chart-column-series',
//   },
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class DtMicroChartColumnSeries {
//   private _data: Array<[number, number]> = [];
//   private _scales: D3ColumnSeriesScales;
//   private _domains: D3ColumnSeriesDomains;
//   private _reflowSub: Subscription;

//   @Input()
//   get data(): Array<[number, number]> {
//     return this._data;
//   }
//   set data(value: Array<[number, number]>) {
//     this._data = value;
//     this._reflow();
//   }

//   @Input() columnSpacing = 0.1;

//   _getXValue(point: [number, number]): number {
//     if (this._scales && this._scales.x) {
//       return this._scales.x(point[0].toString()) || 0;
//     }
//     return 0;
//   }

//   _getYValue(point: [number, number]): number {
//     if (this._scales && this._scales.y) {
//       return this._scales.y(point[1]);
//     }
//     return 0;
//   }

//   _getWidth(): number {
//     if (this._scales && this._scales.x) {
//       return this._scales.x.bandwidth();
//     }
//     return 0;
//   }

//   _getHeight(point: [number, number]): number {
//     if (this._scales && this._scales.y) {
//       return this._scales.y(0) - this._scales.y(point[1]);
//     }
//     return 0;
//   }

//   _isMin(point: [number, number]): boolean {
//     const value = point[1];
//     return this._domains && this._domains.y && value === this._domains.y.min;
//   }

//   _isMax(point: [number, number]): boolean {
//     const value = point[1];
//     return this._domains && this._domains.y && value === this._domains.y.max;
//   }

//   constructor(
//     private _changeDetectorRef: ChangeDetectorRef,
//     @SkipSelf() private _chart: DtMicroChart,
//     @Inject(DT_MICRO_CHART_DEFAULT_OPTIONS) private _config: DtMicroChartConfig
//   ) {
//     this._reflowSub = this._chart._shouldReflow$.subscribe(() => {
//       this._reflow();
//     });
//   }

//   ngOnDestroy(): void {
//     this._reflowSub.unsubscribe();
//   }

//   private _reflow(): void {
//     this._calculateScalesAndDomains(this._chart._shouldReflow$.value);
//     this._changeDetectorRef.markForCheck();
//   }

//   private _calculateScalesAndDomains(width: number): void {
//     if (this._data && width > 0) {
//       const domains = getDomains(this._data);
//       const scales = getScales(domains, this.columnSpacing);
//       scales.x = scales.x.range([0, width - (this._config.marginLeft + this._config.marginRight)]);
//       scales.y = scales.y.range([0, this._config.height - (this._config.marginTop + this._config.marginBottom)]);
//       this._domains = domains;
//       this._scales = scales;
//     }
//   }
// }

// interface D3ColumnSeriesDomains {
//   x: string[];
//   y: { min: number; max: number };
// }

// interface D3ColumnSeriesScales {
//   x: ScaleBand<string>;
//   y: ScaleLinear<number, number>;
// }

// function getDomains(series: Array<[number, number]>): D3ColumnSeriesDomains {
//   return {
//     x: series.map((s) => s[0].toString()),
//     y: getMinMaxValues(series.map((s) => s[1])),
//   };
// }

// function getScales(domains: D3ColumnSeriesDomains, spacing: number): D3ColumnSeriesScales {
//   const x = scaleBand().domain(domains.x).padding(spacing);
//   const y = scaleLinear().domain([domains.y.max, domains.y.min]);
//   return { x, y };
// }
