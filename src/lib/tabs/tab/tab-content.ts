import { Directive } from '@angular/core';

/**
 * Directive to identify ng-template as the content
 * enables lazy loading
 */
@Directive({
  selector: '[dtTabContent]',
  exportAs: 'dtTabContent',
})
export class DtTabContent {}
