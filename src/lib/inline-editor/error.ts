import { Directive, Input } from '@angular/core';

let nextUniqueId = 0;

/** Single error message to be shown underneath the inline editor. */
@Directive({
  selector: 'ie-error',
  host: {
    'role': 'alert',
    '[attr.id]': 'id',
  },
})
export class IeError {
  @Input() id = `ie-error-${nextUniqueId++}`;
}
