import { Component, ViewChild } from '@angular/core';
import { ChartType, DtChart } from '@dynatrace/angular-components/chart';
import { ViewportResizer } from '@dynatrace/angular-components/core';
import { ChartService } from './docs-chart.service';
import { Observable } from 'rxjs/Observable';

@Component({
  moduleId: module.id,
  selector: 'docs-chart',
  styleUrls: ['./docs-chart.component.scss'],
  templateUrl: './docs-chart.component.html',
})
export class DocsChartComponent {
  lineOptions: Highcharts.Options = {
    chart: {
      type: 'line',
    },
    title: {
      text: 'Line chart',
    },
    xAxis: {
       type: 'datetime',
    },
    yAxis: {
      min: 100,
      max: 200,
    },
  };

  columnOptions: Highcharts.Options = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Bar/Column chart',
    },
    xAxis: {
       type: 'datetime',
    },
  };

  pieOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Pie chart',
    },
    xAxis: {
       type: 'datetime',
    },
  };

  data$: Observable<Highcharts.IndividualSeriesOptions[]>;

  dataStatic = [{
    color: '#C396E0',
    name: 'Actions/min',
    data: [
      [
        1370304000000,
        140,
      ],
      [
        1370390400000,
        120,
      ],
      [
        1370476800000,
        170,
      ],
      [
        1370563200000,
        170,
      ],
      [
        1370736000000,
        180,
      ],
      [
        1370822400000,
        160,
      ],
      [
        1370908800000,
        170,
      ],
      [
        1370995200000,
        90
      ],
    ],
  }];

  _menuOpen = false;

  constructor(private _chartService: ChartService, private _viewportResizer: ViewportResizer) {
    this.data$ = this._chartService.getStreamedChartdata();
  }

  toggleMenu(): void {
    this._menuOpen = !this._menuOpen;
    this._viewportResizer.emit();
  }

}
