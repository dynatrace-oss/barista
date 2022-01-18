/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Injectable, InjectionToken, Injector, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';

import { DtLogger, DtLoggerFactory } from '@dynatrace/barista-components/core';

import {
  DT_TOAST_BOTTOM_SPACING,
  DT_TOAST_CHAR_LIMIT,
  DT_TOAST_CHAR_READ_TIME,
  DT_TOAST_DEFAULT_CONFIG,
  DT_TOAST_MIN_DURATION,
  DT_TOAST_PERCEIVE_TIME,
} from './toast-config';
import { DtToastContainer } from './toast-container';
import { DtToastRef } from './toast-ref';

const LOG: DtLogger = DtLoggerFactory.create('DtToast');

/** Token for passing the message to the toast */
export const DT_TOAST_MESSAGE = new InjectionToken<string>('DtToastMessage');

@Injectable({ providedIn: 'root' })
export class DtToast {
  private _openedToastRef: DtToastRef | null = null;
  private _openedToastRefSub = Subscription.EMPTY;

  constructor(
    private _overlay: Overlay,
    private _injector: Injector,
    private _zone: NgZone,
  ) {}

  /** Creates a new toast and dismisses the current one if one exists */
  create(message: string): DtToastRef | null {
    if (message === '') {
      LOG.warn('Message must not be null');
      return null;
    }
    const msg = this._fitMessage(message);
    const overlayRef = this._createOverlay();
    const injector = new PortalInjector(
      this._injector,
      new WeakMap<InjectionToken<string>, string>([[DT_TOAST_MESSAGE, msg]]),
    );
    const containerPortal = new ComponentPortal(
      DtToastContainer,
      null,
      injector,
    );
    const containerRef = overlayRef.attach(containerPortal);
    const container = containerRef.instance;

    const duration = this._calculateToastDuration(msg);
    const toastRef = new DtToastRef(
      container,
      duration,
      overlayRef,
      this._zone,
    );
    this._animateDtToastContainer(toastRef);
    this._openedToastRef = toastRef;
    return this._openedToastRef;
  }

  /** Dismiss the  */
  dismiss(): void {
    if (this._openedToastRef) {
      this._openedToastRef.dismiss();
    }
  }

  /** Creates a new overlay */
  private _createOverlay(): OverlayRef {
    const positionStrategy = this._overlay
      .position()
      .global()
      .centerHorizontally()
      .bottom(`${DT_TOAST_BOTTOM_SPACING}px`);

    return this._overlay.create({
      ...DT_TOAST_DEFAULT_CONFIG,
      positionStrategy,
    });
  }

  /** Calculates the duration the toast is shown based on the message length */
  private _calculateToastDuration(message: string): number {
    return Math.max(
      DT_TOAST_PERCEIVE_TIME + DT_TOAST_CHAR_READ_TIME * message.length,
      DT_TOAST_MIN_DURATION,
    );
  }

  /** Animates the toast components and handles multiple toasts at the same time  */
  private _animateDtToastContainer(toastRef: DtToastRef): void {
    /** clean up reference when no new toast was created in the meantime */
    toastRef.afterDismissed().subscribe(() => {
      if (this._openedToastRef === toastRef) {
        this._openedToastRef = null;
        this._openedToastRefSub.unsubscribe();
      }
    });

    /** check if there is already one toast open */
    if (this._openedToastRef) {
      /** wait until the open toast is dismissed - then open the new one */
      this._openedToastRef.afterDismissed().subscribe(() => {
        toastRef.containerInstance.enter();
      });
      /** dismiss the current open toast */
      this._openedToastRef.dismiss();
      this._openedToastRefSub.unsubscribe();
    } else {
      toastRef.containerInstance.enter();
    }

    this._openedToastRefSub = toastRef.afterOpened().subscribe(() => {
      toastRef._dismissAfterTimeout();
    });
  }

  private _fitMessage(message: string): string {
    if (message.length > DT_TOAST_CHAR_LIMIT) {
      LOG.warn(`Maximum lenght for toast message exceeded for message: "${message}".
        A maximum length of ${DT_TOAST_CHAR_LIMIT} character is allowed`);
      return message.slice(0, DT_TOAST_CHAR_LIMIT);
    }
    return message;
  }
}
