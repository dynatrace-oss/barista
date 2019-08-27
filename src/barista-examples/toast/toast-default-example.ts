import { Component } from '@angular/core';

import { DtToast } from '@dynatrace/angular-components/toast';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: '<button dt-button (click)="createToast()">Save</button>',
})
export class ToastDefaultExample {
  constructor(private _toast: DtToast) {}

  createToast(): void {
    this._toast.create('Your changes have been saved!');
  }
}
