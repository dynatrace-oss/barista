import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'ng-container[dtFilterFieldOptions]',
  exportAs: 'dtFilterFieldOptions',
})
export class DtFilterFieldOptions<T> {
  @Input('dtFilterFieldOptionsDisplayWith') displayWith: ((value: T) => string) | null = null;
}
