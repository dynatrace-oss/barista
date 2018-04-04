import { Component, ViewChild } from '@angular/core';
import { ChartType, DtChart } from '@dynatrace/angular-components/chart';

@Component({
  moduleId: module.id,
  selector: 'docs-chart',
  styleUrls: ['./docs-chart.component.scss'],
  templateUrl: './docs-chart.component.html',
})
export class DocsChartComponent {
  @ViewChild(DtChart) chart: DtChart;
  _chartType: ChartType = 'line';

  changeChartType(value: ChartType): void {
    this._chartType = value;
  }

  addSeries(): void {
    this.chart.addSeries({
      name: 'Linz',
      data: [50, 60, 60, 105, 106.0, 60, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3],
    });
  }
}
