import { Component } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { DtToast, DtToastRef } from '@dynatrace/angular-components/toast';

const TIMERINTERVAL = 50;

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-form-field>
      <dt-label>Message</dt-label>
      <input
        type="text"
        dtInput
        [(ngModel)]="message"
        placeholder="Your message"
      />
    </dt-form-field>
    <p>Current message: {{ message }}</p>
    <p *ngIf="elapsedTime">
      Time elapsed since opening: {{ elapsedTime | async }}ms
    </p>
    <button dt-button (click)="createToast()">Save</button>
  `,
})
export class ToastDynamicMsgExample {
  message = '';
  toastRef: DtToastRef | null = null;
  elapsedTime: Observable<number>;

  constructor(private _toast: DtToast) {}

  createToast(): void {
    this.toastRef = this._toast.create(this.message);
    if (this.toastRef) {
      this.elapsedTime = timer(0, TIMERINTERVAL).pipe(
        takeUntil(this.toastRef.afterDismissed()),
        map((count: number) => TIMERINTERVAL * count),
      );
    }
  }
}
