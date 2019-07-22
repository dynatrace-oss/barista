import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'legend-symbol-attribute-example',
  template: `
    <dt-legend>
      <dt-legend-item>
        <dt-icon dtLegendSymbol name="chart-legend-bar"></dt-icon>
        Requests
      </dt-legend-item>
      <dt-legend-item>
        <dt-icon dtLegendSymbol name="chart-legend-line"></dt-icon>
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
export class SymbolAttributeLegendExample {}
