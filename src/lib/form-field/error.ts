import { Directive, Input } from '@angular/core';

let nextUniqueId = 0;

/** Single error message to be shown underneath the form field. */
@Directive({
  selector: 'dt-error',
  host: {
    'class': 'dt-error',
    'role': 'alert',
    '[attr.id]': 'id',
  },
})
export class DtError {
  @Input() id = `dt-error-${nextUniqueId++}`;
}
