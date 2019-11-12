import { Directive } from '@angular/core';

/** Prefix to be placed the the front of the form field. */
@Directive({
  selector: '[dtPrefix]',
  exportAs: 'dtPrefix',
  host: {
    class: 'dt-prefix',
  },
})
export class DtPrefix {}
