import { Component, ViewChild } from '@angular/core';
import { DtChart } from '@dynatrace/angular-components/chart';
import { ViewportResizer } from '@dynatrace/angular-components/core';
import { ChartService } from './docs-chart.service';
import { Observable } from 'rxjs/Observable';

@Component({
  moduleId: module.id,
  selector: 'docs-chart',
  templateUrl: './docs-chart.component.html',
})
export class DocsChartComponent {
  loading: false;
  dataStaticDelayed = null;

  lineOptions: Highcharts.Options = {
    xAxis: {
       type: 'datetime',
    },
    yAxis: {
      min: 100,
      max: 200,
    },
  };

  columnOptions: Highcharts.Options = {
    xAxis: {
       type: 'datetime',
    },
  };

  pieOptions: Highcharts.Options = {
    xAxis: {
       type: 'datetime',
    },
  };

  data$: Observable<Highcharts.IndividualSeriesOptions[]>;

  dataStatic: Highcharts.IndividualSeriesOptions[] = [{
    name: 'Actions/min',
    id: 'SomeMetricId',
    type: 'area',
    data: [
      [
        1370304000000,
        140,
      ],
      [
        1370390400000,
        120,
      ],
    ],
  }];

  dataStaticMulti: Highcharts.IndividualSeriesOptions[] = [{
    name: 'Actions/min',
    id: 'SomeMetricId',
    type: 'area',
    data: [
      [
        1370304000000,
        140,
      ],
      [
        1370390400000,
        120,
      ],
    ],
  }, {
    name: 'Requests/min',
    id: 'requestsId',
    type: 'area',
    data: [
      [
        1370304000000,
        160,
      ],
      [
        1370390400000,
        150,
      ],
    ],
  }];

  @ViewChild('static') staticChart: DtChart;

  _menuOpen = false;

  constructor(private _chartService: ChartService, private _viewportResizer: ViewportResizer) {
    this.data$ = this._chartService.getStreamedChartdata();
  }

  toggleMenu(): void {
    this._menuOpen = !this._menuOpen;
    this._viewportResizer.emit();
  }

}
