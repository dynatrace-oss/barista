import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'legend-default-example',
  template: `
    <dt-legend>
      <dt-legend-item>
        <dt-legend-symbol>
          <dt-icon name="chart-legend-bar"></dt-icon>
        </dt-legend-symbol>
        <ng-template dtLegendOverlay>
          This is some content that should open inside an overlay
        </ng-template>
        Requests
      </dt-legend-item>
      <dt-legend-item>
        <dt-legend-symbol>
          <dt-icon name="chart-legend-line"></dt-icon>
        </dt-legend-symbol>
        Failed Requests
      </dt-legend-item>
    </dt-legend>
  `,
  styles: [
    `
      dt-icon {
        vertical-align: -5px;
        width: 16px;
      }
    `,
  ],
})
export class OverlayLegendExample {}
