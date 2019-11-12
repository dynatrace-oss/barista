import { Directive } from '@angular/core';

/** Suffix to be placed at the end of the form field. */
@Directive({
  selector: '[dtSuffix]',
  exportAs: 'dtSuffix',
  host: {
    class: 'dt-suffix',
  },
})
export class DtSuffix {}
