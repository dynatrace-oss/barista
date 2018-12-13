import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <input dtInput placeholder="Please insert text" [disabled]="isDisabled"/>
    <p><button dt-button (click)="isDisabled = !isDisabled">Toggle disabled</button></p>

    <input dtInput placeholder="Please insert text" [readonly]="isReadonly"/>
    <p><button dt-button (click)="isReadonly = !isReadonly">Toggle readonly</button></p>
  `,
})
@OriginalClassName('DisabledReadonlyInputExample')
export class DisabledReadonlyInputExample {
  isDisabled = false;
  isReadonly = false;
}
