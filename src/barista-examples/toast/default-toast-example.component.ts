import { Component } from '@angular/core';
import { DtToast } from '@dynatrace/angular-components';

@Component({
  moduleId: module.id,
  template: '<button dt-button (click)="createToast()">Save</button>',
})
@OriginalClassName('DefaultToastExampleComponent')
export class DefaultToastExampleComponent {
  constructor(private _toast: DtToast) {}

  createToast(): void {
    this._toast.create('Your changes have been saved!');
  }
}
