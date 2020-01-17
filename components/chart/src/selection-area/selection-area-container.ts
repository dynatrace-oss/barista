/**
 * @license
 * Copyright 2020 Dynatrace LLC
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
  Component,
  ChangeDetectorRef,
  ElementRef,
  EmbeddedViewRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  AnimationEvent,
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

import {
  mixinNotifyDomExit,
  HasNgZone,
  CanNotifyOnExit,
} from '@dynatrace/barista-components/core';
import { Subject } from 'rxjs';
import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';

import { DT_SELECTION_AREA_FADE_TIME } from './constants';

// Boilerplate for applying mixins to DtChartSelectionAreaContainer.
export class DtChartSelectionAreaContainerBase implements HasNgZone {
  constructor(public _ngZone: NgZone) {}
}
export const _DtChartSelectionAreaContainerMixin = mixinNotifyDomExit(
  DtChartSelectionAreaContainerBase,
);

@Component({
  selector: 'dt-chart-selection-area-container',
  template: '<ng-template cdkPortalOutlet></ng-template>',
  styleUrls: ['selection-area-container.scss'],
  host: {
    class: 'dt-chart-selection-area-container',
    '[@fade]': '_animationState',
    '(@fade.done)': '_animationDone($event)',
  },
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0 })),
      state('enter', style({ opacity: 1 })),
      transition(
        ':enter',
        animate(`${DT_SELECTION_AREA_FADE_TIME}ms ease-in-out`),
      ),
      transition(
        ':leave',
        animate(`${DT_SELECTION_AREA_FADE_TIME}ms ease-in-out`),
      ),
    ]),
  ],
})
export class DtChartSelectionAreaContainer
  extends _DtChartSelectionAreaContainerMixin
  implements OnDestroy, CanNotifyOnExit {
  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;

  private _destroyed = false;

  /** @internal Stream that emits when a selection area overlay enters the view. */
  readonly _onEnter: Subject<void> = new Subject();

  /** @internal Stream that emits when a selection area overlay leaves the view. */
  readonly _onLeaving: Subject<void> = new Subject();

  /** @internal Stream that emits when a selection area overlay leave animation is complete. */
  readonly _onLeaveDone: Subject<void> = new Subject();

  /** @internal The current state of the animation. */
  _animationState: 'void' | 'enter' = 'void';

  constructor(
    public _ngZone: NgZone,
    public _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    super(_ngZone);
  }

  ngOnDestroy(): void {
    this._destroyed = true;
  }

  /**
   * Attach a TemplatePortal as content to this dialog container.
   * @param portal Portal to be attached as the dialog content.
   */
  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this._portalOutlet.hasAttached()) {
      throw Error('already attached');
    }

    return this._portalOutlet.attachTemplatePortal(portal);
  }

  /**
   * Detach an existing TemplatePortal, then attach a
   * TemplatePortal as content to this dialog container.
   * @param portal Portal to be attached as the dialog content.
   */
  updateTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this._portalOutlet.hasAttached()) {
      this._portalOutlet.detach();
    }

    return this._portalOutlet.attachTemplatePortal(portal);
  }

  /** @internal Animation callback. */
  _animationDone(event: AnimationEvent): void {
    const { fromState, toState } = event;

    if (toState === 'void' && fromState !== 'void') {
      this._onLeaveDone.next();
    }

    if (toState === 'enter') {
      // Note: we shouldn't use `this` inside the zone callback,
      // because it can cause a memory leak.
      const onEnter = this._onEnter;

      this._ngZone.run(() => {
        onEnter.next();
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
    this._onLeaving.next();
    this._animationState = 'void';
  }
}
