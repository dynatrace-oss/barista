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

import {
  AnimationEvent,
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';

import {
  CanNotifyOnExit,
  HasNgZone,
  mixinNotifyDomExit,
} from '@dynatrace/barista-components/core';

import { DT_TOAST_MESSAGE } from './toast';
import { DT_TOAST_FADE_TIME } from './toast-config';

// Boilerplate for applying mixins to DtToastContainer.
export class DtToastContainerBase implements HasNgZone {
  constructor(public _ngZone: NgZone) {}
}
export const _DtToastContainerMixin = mixinNotifyDomExit(DtToastContainerBase);

@Component({
  selector: 'dt-toast',
  exportAs: 'dtToast',
  template: '{{message}}',
  styleUrls: ['toast-container.scss'],
  host: {
    class: 'dt-toast-container',
    role: 'alert',
    '[@fade]': '_animationState',
    '(@fade.done)': '_animationDone($event)',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  animations: [
    trigger('fade', [
      state('enter', style({ opacity: 1 })),
      transition(
        'enter => exit',
        animate(`${DT_TOAST_FADE_TIME}ms ease-in-out`),
      ),
      transition(
        'void => enter',
        animate(`${DT_TOAST_FADE_TIME}ms ease-in-out`),
      ),
    ]),
  ],
})
export class DtToastContainer
  extends _DtToastContainerMixin
  implements OnDestroy, CanNotifyOnExit
{
  private _destroyed = false;

  /** @internal Stream that emits when a toast enters the view. */
  readonly _onEnter: Subject<void> = new Subject();

  /** @internal The current state of the animation. */
  _animationState = 'void';

  constructor(
    @Inject(DT_TOAST_MESSAGE) public message: string,
    public _ngZone: NgZone,
    public _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    super(_ngZone);
  }

  ngOnDestroy(): void {
    this._destroyed = true;
    this._notifyDomExit();
  }

  /** @internal Animation callback. */
  _animationDone(event: AnimationEvent): void {
    const { fromState, toState } = event;

    if ((toState === 'void' && fromState !== 'void') || toState === 'exit') {
      this._notifyDomExit();
    }

    if (toState === 'enter') {
      // Note: we shouldn't use `this` inside the zone callback,
      // because it can cause a memory leak.
      const onEnter = this._onEnter;

      this._ngZone.run(() => {
        onEnter.next();
        onEnter.complete();
      });
    }
  }

  /** Sets the animation state for entering */
  enter(): void {
    if (!this._destroyed) {
      this._animationState = 'enter';
      this._changeDetectorRef.detectChanges();
    }
  }

  /** Sets the animation state for exiting */
  exit(): void {
    this._animationState = 'exit';
  }
}
