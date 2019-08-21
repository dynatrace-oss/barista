import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import {
  addCssClass,
  readKeyCode,
  removeCssClass,
} from '@dynatrace/angular-components/core';

import { DtMouseFollowPositionStrategy } from './mouse-follow-position-strategy';
import { DT_OVERLAY_NO_POINTER_CLASS } from './overlay';
import { DtOverlayConfig } from './overlay-config';
import { DtOverlayContainer } from './overlay-container';

export class DtOverlayRef<T> {
  /** The instance of component opened into the overlay. */
  // @breaking-change 5.0.0 Change type to `T | null` and assign value `null` as default.
  componentInstance: T;

  /** Wether the overlay is pinned or not */
  get pinned(): boolean {
    return this._pinned;
  }

  get pinnable(): boolean {
    return coerceBooleanProperty(this._config.pinnable);
  }

  /** Subject for notifying the user that the overlay has finished exiting. */
  private readonly _afterExit = new Subject<void>();

  private _pinned = false;
  private _backDropClickSub = Subscription.EMPTY;
  private _disposableFns: Array<() => void> = [];

  get disposableFns(): Array<() => void> {
    return this._disposableFns;
  }

  constructor(
    private _overlayRef: OverlayRef,
    public containerInstance: DtOverlayContainer,
    private _config: DtOverlayConfig,
  ) {
    containerInstance._onDomExit.pipe(take(1)).subscribe(() => {
      this._overlayRef.dispose();
      this._pinned = false;
      this._afterExit.next();
    });

    _overlayRef
      .keydownEvents()
      .pipe(
        filter(
          (event: KeyboardEvent) =>
            readKeyCode(event) === ESCAPE && !hasModifierKey(event),
        ),
      )
      .subscribe(() => {
        this.dismiss();
      });
  }

  /** Pins the overlay */
  pin(value: boolean): void {
    if (!this._config.pinnable) {
      return;
    }
    this._pinned = value;
    if (this._overlayRef.backdropElement) {
      if (value) {
        this.containerInstance._trapFocus();
        removeCssClass(
          this._overlayRef.backdropElement,
          DT_OVERLAY_NO_POINTER_CLASS,
        );
        this._overlayRef.backdropClick().subscribe(() => {
          this.dismiss();
        });
      } else {
        addCssClass(
          this._overlayRef.backdropElement,
          DT_OVERLAY_NO_POINTER_CLASS,
        );
        this._backDropClickSub.unsubscribe();
      }
    }
  }

  /** Dismisses the overlay */
  dismiss(): void {
    this.containerInstance.exit();
    this._disposableFns.forEach(fn => {
      fn();
    });
  }

  /**
   * Updates the position of the overlay by an offset relative to the top left corner of the origin
   */
  updatePosition(offsetX: number, offsetY: number): void {
    const config = this._overlayRef.getConfig();
    if (
      config.positionStrategy &&
      config.positionStrategy instanceof DtMouseFollowPositionStrategy
    ) {
      config.positionStrategy.withOffset(offsetX, offsetY);
    }

    this._overlayRef.updatePosition();
  }

  /**
   * Gets an observable that is notified when the overlay exited.
   */
  afterExit(): Observable<void> {
    return this._afterExit.asObservable();
  }
}
