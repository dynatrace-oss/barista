import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-chart-highcharts-ui',
  templateUrl: 'chart-highcharts-ui.html',
})
export class ChartHighchartsUI {
  options = {
    chart: {
      type: 'arearange',
    },
    xAxis: {
      type: 'datetime',
    },
    tooltip: {
      formatter(): string | boolean {
        return `${this.series.name}&nbsp${this.y}`;
      },
    },
  };
  series = [{
    name: 'Temperatures',
    data: [
      [1483232400000, 1.4, 4.7],
      [1483318800000, -1.3, 1.9],
    ],
  }];
}
