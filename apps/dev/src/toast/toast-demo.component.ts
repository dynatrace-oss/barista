import { Component } from '@angular/core';

import { DtToast } from '@dynatrace/angular-components/toast';

@Component({
  selector: 'toast-dev-app-demo',
  templateUrl: './toast-demo.component.html',
  styleUrls: ['./toast-demo.component.scss'],
})
export class ToastDemo {
  constructor(private _toast: DtToast) {}

  createToast(): void {
    this._toast.create('Your changes have been saved!');
  }
}
