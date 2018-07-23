import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';
import { DtToast } from '@dynatrace/angular-components';

let id = 0;

@Component({
  moduleId: module.id,
  template: '<button dt-button (click)="createToast()">Save</button>',
})
@OriginalClassName('DefaultToastExampleComponent')
export class DefaultToastExampleComponent {
  constructor(private _toast: DtToast) {}
  createToast(): void {
    this._toast.create(`Your changes have been saved.${++id}`);
  }
}
