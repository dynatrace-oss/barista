import { Input, ChangeDetectorRef, ChangeDetectionStrategy, Component, SkipSelf } from '@angular/core';
import { DtMicroChartSeriesSVG } from './series';
import { getMinMaxValues } from '../helper-functions';
import { line } from 'd3-shape';
import { scaleLinear, ScaleLinear, scaleBand, ScaleBand } from 'd3-scale';
import { DtMicroChartSeriesType } from '../public-api';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DtMicroChartV2 } from '../micro-chart-v2';

@Component({
  selector: 'g[dt-micro-chart-bar-series]',
  host: {
    class: 'dt-micro-chart-series, dt-micro-chart-bar-series',
  },
  templateUrl: './bar.html',
  styleUrls: ['bar.scss'],
  inputs: ['stacked'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: DtMicroChartSeriesSVG, useExisting: DtMicroChartBarSeriesSVG }],
})
export class DtMicroChartBarSeriesSVG extends DtMicroChartSeriesSVG {
  @Input() points: { x: number; y: number }[];
}

interface D3BarSeriesDomains {
  x: { min: number; max: number };
  y: string[];
}

interface D3BarSeriesScales {
  x: ScaleLinear<number, number>;
  y: ScaleBand<string>;
}

function getDomains(series: number[][]): D3BarSeriesDomains {
  return {
    x: getMinMaxValues(series.map((s) => s[1])),
    y: series.map((s) => s[0].toString()),
  };
}

function getScales(domains: D3BarSeriesDomains, spacing: number): D3BarSeriesScales {
  const x = scaleLinear().domain([domains.x.max, domains.x.min]);
  const y = scaleBand().domain(domains.y).padding(spacing);
  console.log('get scales');
  return { x, y };
}
