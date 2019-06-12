import { Component, ViewChild, ElementRef } from '@angular/core';
import { DtOverlay } from '@dynatrace/angular-components/overlay';

@Component({
  moduleId: module.id,
  template: 'overlay',
})
export class DummyOverlay {}

@Component({
  moduleId: module.id,
  template: `
  <button dt-button (click)="createOverlay()">Create overlay</button>
  <button dt-button (click)="dismiss()">Dismiss</button>
  <p><span #origin>An overlay will be created here</span></p>
  `,
})
export class ProgrammaticOverlayExampleComponent {
  @ViewChild('origin', { static: true }) origin: ElementRef;

  constructor(private _dtOverlay: DtOverlay) {}

  createOverlay(): void {
    this._dtOverlay.create(this.origin, DummyOverlay);
  }

  dismiss(): void {
    this._dtOverlay.dismiss();
  }
}
