import { Directive, ElementRef } from '@angular/core';

/**
 * Directive applied to an element to make it usable
 * as a connection point for an autocomplete panel.
 */
@Directive({
  selector: '[dtAutocompleteOrigin]',
  exportAs: 'dtAutocompleteOrigin',
})
export class DtAutocompleteOrigin {
  constructor(public elementRef: ElementRef<HTMLElement>) {}
}
