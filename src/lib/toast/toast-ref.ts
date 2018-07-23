import { DtToastContainer } from './toast-container';
import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';

export class DtToastRef {
  containerInstance: DtToastContainer;

  private _durationTimeoutId: number;

  _afterDismissed = new Subject<void>();

  constructor(
    containerInstance: DtToastContainer,
    private _overlayRef: OverlayRef,
    private _duration: number
  ) {
    this.containerInstance = containerInstance;
    containerInstance._afterLeave.subscribe(() => {
      console.log('afterleave triggered');
      this._overlayRef.dispose();
      this._afterDismissed.next();
    });
    this._durationTimeoutId = window.setTimeout(() => this._dismiss(), this._duration);
  }

  _dismiss(): void {
    this._overlayRef.detach();
    clearTimeout(this._durationTimeoutId);
  }
}
