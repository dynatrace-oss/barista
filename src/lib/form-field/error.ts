import { Directive, ElementRef, Input } from '@angular/core';

let nextUniqueId = 0;

/** Single error message to be shown underneath the form field. */
@Directive({
  selector: 'dt-error',
  exportAs: 'dtError',
  host: {
    class: 'dt-error',
    role: 'alert',
    '[attr.id]': 'id',
  },
})
export class DtError {
  @Input() id = `dt-error-${nextUniqueId++}`;

  constructor(private _elementRef: ElementRef) {}

  /**
   * Exposing message here so other components,
   * like inline-editor can access and clone it
   */
  get message(): string {
    return this._elementRef.nativeElement.textContent;
  }
}
