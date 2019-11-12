import { Component } from '@angular/core';

import { DtToast } from '@dynatrace/barista-components/toast';

@Component({
  selector: 'component-barista-example',
  template: '<button dt-button (click)="createToast()">Save</button>',
})
export class ToastDefaultExample {
  constructor(private _toast: DtToast) {}

  createToast(): void {
    this._toast.create('Your changes have been saved!');
  }
}
