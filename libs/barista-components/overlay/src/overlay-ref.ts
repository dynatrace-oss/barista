/**
 * @license
 * Copyright 2021 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import {
  _addCssClass,
  _readKeyCode,
  _removeCssClass,
} from '@dynatrace/barista-components/core';

import { DT_OVERLAY_NO_POINTER_CLASS } from './overlay';
import { DtOverlayConfig } from './overlay-config';
import { DtOverlayContainer } from './overlay-container';

export class DtOverlayRef<T> {
  /** The instance of component opened into the overlay. */
  componentInstance: T | null = null;

  /** @internal TemplatePortal to which the overlay got attached. */
  _templatePortal: TemplatePortal | null = null;

  /** Wether the overlay is pinned or not */
  get pinned(): boolean {
    return this._pinned;
  }

  /** Whether the overlay can be pinned or not */
  get pinnable(): boolean {
    return coerceBooleanProperty(this._config.pinnable);
  }

  /** Subject for notifying the user that the overlays pinned state has changed */
  pinnedChanged = new Subject<boolean>();

  /** Subject for notifying the user that the overlay has finished exiting. */
  private readonly _afterExit = new Subject<void>();

  private _pinned = false;
  private _backDropClickSub = Subscription.EMPTY;
  private _disposableFns: Array<() => void> = [];

  /** List of functions to be called when the overlay is disposed. */
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
            _readKeyCode(event) === ESCAPE && !hasModifierKey(event),
        ),
      )
      .subscribe(() => {
        this.dismiss();
      });
  }

  /** Pins the overlay */
  pin(value: boolean): void {
    if (!this._config.pinnable || this._pinned === value) {
      return;
    }

    this._pinned = value;
    if (this._overlayRef.backdropElement) {
      if (value) {
        this.containerInstance._trapFocus();
        _removeCssClass(
          this._overlayRef.backdropElement,
          DT_OVERLAY_NO_POINTER_CLASS,
        );
        merge(
          this._overlayRef.backdropClick(),
          this._overlayRef.detachments().pipe(filter(() => this._pinned)), // emits when closed via scrolling
        )
          .pipe(take(1))
          .subscribe(() => {
            this.dismiss();
          });
      } else {
        _addCssClass(
          this._overlayRef.backdropElement,
          DT_OVERLAY_NO_POINTER_CLASS,
        );
        this._backDropClickSub.unsubscribe();
      }
    }
    this.pinnedChanged.next(value);
  }

  /** Update the implicit context on the template portal if one exists. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateImplicitContext(data: any): void {
    if (this._templatePortal) {
      this._templatePortal.context.$implicit = data;
    }
  }

  /** Dismisses the overlay */
  dismiss(): void {
    this.containerInstance.exit();
    this._disposableFns.forEach((fn) => {
      fn();
    });
    this.pinnedChanged.next(false);
  }

  /**
   * Updates the position of the overlay by an offset relative to the top left corner of the origin
   * NOTE: The parameters are not changing the behavior anymore since
   * the position can be done without the offset to the left top corner
   */
  updatePosition(_offsetX?: number, _offsetY?: number): void {
    this._overlayRef.updatePosition();
  }

  /**
   * Gets an observable that is notified when the overlay exited.
   */
  afterExit(): Observable<void> {
    return this._afterExit.asObservable();
  }
}
