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

import { AnimationEvent } from '@angular/animations';
import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import {
  Component,
  ChangeDetectorRef,
  EmbeddedViewRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { dtFadeAnimation } from '@dynatrace/barista-components/core';
import { Subject } from 'rxjs';
import { DT_CHART_SELECTION_AREA_ALREADY_ATTACHED_ERROR } from './constants';

@Component({
  selector: 'dt-chart-selection-area-container',
  template: '<ng-template cdkPortalOutlet></ng-template>',
  styleUrls: ['selection-area-container.scss'],
  host: {
    class: 'dt-chart-selection-area-container',
    '[@fade]': '_overlayAnimationState',
    '(@fade.done)': '_animationDone($event)',
  },
  animations: [dtFadeAnimation],
})
export class DtChartSelectionAreaContainer implements OnDestroy {
  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;

  private _destroyed = false;

  /** @internal Stream that emits when a selection area overlay enters the view. */
  readonly _onEnter: Subject<void> = new Subject();

  /** @internal Stream that emits when a selection area overlay leaves the view. */
  readonly _onLeaving: Subject<void> = new Subject();

  /** @internal Stream that emits when a selection area overlay leave animation is complete. */
  readonly _onLeaveDone: Subject<void> = new Subject();

  /** @internal The current state of the animation. */
  _overlayAnimationState: 'void' | 'enter' = 'void';

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this._destroyed = true;
  }

  /**
   * Attach a TemplatePortal as content to this dialog container.
   * @param portal Portal to be attached as the dialog content.
   */
  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this._portalOutlet.hasAttached()) {
      throw Error(DT_CHART_SELECTION_AREA_ALREADY_ATTACHED_ERROR);
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
      this._onEnter.next();
    }
  }

  /** Sets the animation state for entering */
  enter(): void {
    if (!this._destroyed) {
      this._overlayAnimationState = 'enter';
      this._changeDetectorRef.detectChanges();
    }
  }

  /** Sets the animation state for exiting */
  exit(): void {
    this._onLeaving.next();
    this._overlayAnimationState = 'void';
  }
}
