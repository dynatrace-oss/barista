import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  ContentChildren,
  AfterContentInit,
  AfterViewInit,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { DtRadialChartSeries } from './public-api/radial-chart-series';
import { Subject } from 'rxjs';
import { arc } from 'd3-shape';

type DtRadialChartType = 'pie' | 'donut';

@Component({
  moduleId: module.id,
  selector: 'dt-radial-chart',
  exportAs: 'dtRadialChart',
  templateUrl: 'radial-chart.html',
  styleUrls: ['radial-chart.scss'],
  host: {
    class: 'dt-radial-chart',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtRadialChart implements AfterViewInit, OnDestroy {
  /** @internal Destroy subject to clear subscriptions on component destroy. */
  private readonly _destroy = new Subject<void>();

  @Input() type: DtRadialChartType = 'pie';
  @Input() background: string;
  @Input() maxValue: number;
  @Input() start: number;

  _radius = 250;
  _width = 2 * this._radius;
  _arcGenerator = arc();

  get _viewBox(): string {
    return `0 0 ${this._width} ${this._width}`;
  }

  /** Series data, <svg:g dt-radial-chart-series> */
  @ContentChildren(DtRadialChartSeries) _radialChartSeries: QueryList<
    DtRadialChartSeries
  >;

  // _renderData = new Subject<any>();
  _renderData: string[] = [];

  /** AfterViewInit hook */
  ngAfterViewInit(): void {
    console.log('after content init');
    console.log(this._radialChartSeries);

    // this._radialChartSeries.changes.subscribe(() => {});

    // TODO: everytime series gets an update, values have to be updated
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  _getPathData(value: number): string {
    // TODO: take the series data value and get path data for the svg based on maxValue and start
    const innerRadius = this.type === 'pie' ? 0 : 80;
    return this._arcGenerator({
      innerRadius,
      outerRadius: 100,
      startAngle: 0,
      endAngle: 2,
    });
  }
}
