import { Directive } from '@angular/core';
import { CanDisable, mixinDisabled } from '@dynatrace/angular-components/core';

let stackId = 0;

// Boilerplate for applying mixins to DtMicroChartStackedContainer.
export class DtMicroChartStackContainerBase {}

export const _DtMicroChartStackContainerBase = mixinDisabled(
  DtMicroChartStackContainerBase,
);

@Directive({
  selector: 'dt-micro-chart-stack-container',
  exportAs: 'dtMicroChartStackContainer',
  inputs: ['disabled'],
})
export class DtMicroChartStackContainer extends _DtMicroChartStackContainerBase
  implements CanDisable {
  /** @internal Unique id for the chart stack container. */
  readonly _stackId = stackId++;
}
