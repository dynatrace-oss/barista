import { DtToastContainer } from './toast-container';
import { OverlayRef } from '@angular/cdk/overlay';
import { Subject, Observable } from 'rxjs';

export class DtToastRef {

  /** The instance for the toast-container that holds the message */
  containerInstance: DtToastContainer;

  /** The duration the toastref will be displayed */
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
    containerInstance._onDomExit.subscribe(() => {
      this._overlayRef.dispose();
      this._afterDismissed.next();
      this._afterDismissed.complete();
    });
  }

  /** Observable that emits when the toast finished the dismissal */
  afterDismissed(): Observable<void> {
    return this._afterDismissed.asObservable();
  }

  /** Observable that emits when the toast has finished the enter animation */
  afterOpened(): Observable<void> {
    return this.containerInstance._onEnter;
  }

  /** Dismisses the toast */
  dismiss(): void {
    if (!this._afterDismissed.closed) {
      this.containerInstance.exit();
    }
    clearTimeout(this._durationTimeoutId);
  }

  _dismissAfterTimeout(): void {
    this._durationTimeoutId = window.setTimeout(() => { this.dismiss(); }, this.duration);
  }
}
