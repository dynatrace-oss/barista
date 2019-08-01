import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-radial-chart>
      <dt-radial-chart-series value="43" name="Chrome">
      </dt-radial-chart-series>
      <dt-radial-chart-series value="22" name="Safari">
      </dt-radial-chart-series>
      <dt-radial-chart-series value="15" name="Edge"></dt-radial-chart-series>
    </dt-radial-chart>
  `,
})
export class RadialChartDefaultExample {}
