import { DtToastContainer } from './toast-container';
import { OverlayRef } from '@angular/cdk/overlay';
import { Subject, Observable } from 'rxjs';

export class DtToastRef {

  containerInstance: DtToastContainer;

  duration: number;

  private _durationTimeoutId: number;

  private readonly _afterDismissed = new Subject<void>();

  constructor(
    containerInstance: DtToastContainer,
    duration: number,
    private _overlayRef: OverlayRef
  ) {
    this.containerInstance = containerInstance;
    this.duration = duration;
    containerInstance._onExit.subscribe(() => {
      this._overlayRef.dispose();
      this._afterDismissed.next();
      this._afterDismissed.complete();
    });
  }

  afterDismissed(): Observable<void> {
    return this._afterDismissed.asObservable();
  }

  afterOpened(): Observable<void> {
    return this.containerInstance._onEnter;
  }

  dismiss(): void {
    if (!this._afterDismissed.closed) {
      this.containerInstance.exit();
    }
    clearTimeout(this._durationTimeoutId);
  }

  dismissAfterTimeout(): void {
    this._durationTimeoutId = window.setTimeout(() => this.dismiss(), this.duration);
  }
}
