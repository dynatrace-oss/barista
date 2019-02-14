import { Input, SkipSelf, Inject, ChangeDetectorRef, ChangeDetectionStrategy, Directive, Component } from '@angular/core';
import { DtMicroChartSeriesSVG } from './series';
import { DtMicroChartConfig } from '../micro-chart-config';
import { getMinMaxValues } from '../helper-functions';
import { line } from 'd3-shape';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { DtMicroChartSeriesType } from '../public-api';

@Component({
  selector: 'g[dt-micro-chart-line-series]',
  host: {
    class: 'dt-micro-chart-series, dt-micro-chart-line-series',
  },
  templateUrl: './line.html',
  styleUrls: ['line.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: DtMicroChartSeriesSVG, useExisting: DtMicroChartLineSeriesSVG }],
})
export class DtMicroChartLineSeriesSVG extends DtMicroChartSeriesSVG {
  readonly type: DtMicroChartSeriesType = 'line';
  private _data: Array<[number, number]> = [];
  private _scales: D3LineSeriesScales;
  private _domains: D3LineSeriesDomains;

  /** @internal */
  _path: string;
  private _width: number;

  @Input()
  get data(): Array<[number, number]> {
    return this._data;
  }
  set data(value: Array<[number, number]>) {
    this._data = value;
    this._reflow(this._width);
  }

  /** @internal */
  _config: DtMicroChartConfig;

  _getXValue(point: [number, number]): number {
    if (this._scales && this._scales.x) {
      return this._scales.x(point[0]);
    }
    return 0;
  }

  _getYValue(point: [number, number]): number {
    if (this._scales && this._scales.y) {
      return this._scales.y(point[1]);
    }
    return 0;
  }

  _isMin(point: [number, number]): boolean {
    const value = point[1];
    return this._domains && this._domains.y && value === this._domains.y.min;
  }

  _isMax(point: [number, number]): boolean {
    const value = point[1];
    return this._domains && this._domains.y && value === this._domains.y.max;
  }

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    super();
  }

  _reflow(width: number): void {
    this._width = width;
    this._calculateScalesAndDomains(width);
    this._calculatePath();
    this._changeDetectorRef.markForCheck();
  }

  private _calculateScalesAndDomains(width: number): void {
    if (this._data && width > 0) {
      const domains = getDomains(this._data);
      const scales = getScales(domains);
      scales.x = scales.x.range([0, width - (this._config.marginLeft + this._config.marginRight)]);
      scales.y = scales.y.range([0, this._config.height - (this._config.marginTop + this._config.marginBottom)]);
      this._domains = domains;
      this._scales = scales;
    }
  }

  private _calculatePath(): void {
    if (this._data && this._scales) {
      const lineGenerator = line()
        .x((d) => this._scales.x(d[0]))
        .y((d) => this._scales.y(d[1]));
      this._path = lineGenerator(this._data) || '';
    }
  }
}

interface D3LineSeriesDomains {
  x: { min: number; max: number };
  y: { min: number; max: number };
}

interface D3LineSeriesScales {
  x: ScaleLinear<number, number>;
  y: ScaleLinear<number, number>;
}

function getDomains(series: Array<[number, number]>): D3LineSeriesDomains {
  return {
    x: getMinMaxValues(series.map((s) => s[0])),
    y: getMinMaxValues(series.map((s) => s[1])),
  };
}

function getScales(domains: D3LineSeriesDomains): D3LineSeriesScales {
  const x = scaleLinear().domain([domains.x.min, domains.x.max]);
  const y = scaleLinear().domain([domains.y.max, domains.y.min]);
  return { x, y };
}
