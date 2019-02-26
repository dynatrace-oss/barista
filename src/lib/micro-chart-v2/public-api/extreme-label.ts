import {
  Directive,
} from '@angular/core';

@Directive({
  selector: '[dtMicroChartMinLabel]',
  exportAs: 'dtMicroChartMinLabel',
})
export class DtMicroChartMinLabel {}

@Directive({
  selector: '[dtMicroChartMaxLabel]',
  exportAs: 'dtMicroChartMaxLabel',
})
export class DtMicroChartMaxLabel {}
