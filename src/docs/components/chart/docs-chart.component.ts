import { Component } from '@angular/core';
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
}
