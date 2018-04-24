import { Component, ViewChild } from '@angular/core';
import { DtChart } from '@dynatrace/angular-components/chart';
import { ViewportResizer } from '@dynatrace/angular-components/core';
import { ChartService } from './docs-chart.service';
import { Observable } from 'rxjs/Observable';
import { Colors } from '@dynatrace/angular-components/theming';
import { ChartDefaultExampleComponent } from './examples/chart-default-example.component';
import { ChartStreamExampleComponent } from './examples/chart-stream-example.component';
import { ChartThemingExampleComponent } from './examples/chart-theming-example.component';
import { ChartLoadingExampleComponent } from './examples/chart-loading-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-chart',
  templateUrl: './docs-chart.component.html',
})
export class DocsChartComponent {

  examples = {
    default: ChartDefaultExampleComponent,
    stream: ChartStreamExampleComponent,
    theming: ChartThemingExampleComponent,
    loading: ChartLoadingExampleComponent,
  };

  loading: false;
  dataStaticDelayed = null;

  options: Highcharts.Options = {
    xAxis: {
       type: 'datetime',
    },
    yAxis: {
      min: 100,
      max: 200,
    },
  };

  data$: Observable<Highcharts.IndividualSeriesOptions[]>;

  dataLegend: Highcharts.IndividualSeriesOptions[] = [{
    name: 'Area',
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
  },
  {
    name: 'Column',
    type: 'column',
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
  },
  {
    name: 'Line',
    type: 'line',
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

  optionsPie: Highcharts.Options = {
    chart: {
      type: 'pie',
    },
    plotOptions: {
      pie: {
          showInLegend: true,
      },
    },
  };

  dataPie: Highcharts.IndividualSeriesOptions[] = [{
    name: 'Data',
    data: [
      {
        name: 'p1',
        y: 30,
        color: Colors.PURPLE_700,
      },
      {
        name: 'p2',
        y: 70,
        color: Colors.PURPLE_200,
      },
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
