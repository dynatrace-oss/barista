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

import { DT_CHART_TOOLTIP_FADE_TIME } from './chart-tooltip-config';
import {
  mixinNotifyDomExit,
  HasNgZone,
  CanNotifyOnExit,
} from '@dynatrace/barista-components/core';
import { Subject } from 'rxjs';
import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';

// Boilerplate for applying mixins to DtChartTooltipContainer.
export class DtChartTooltipContainerBase implements HasNgZone {
  constructor(public _ngZone: NgZone) {}
}
export const _DtChartTooltipContainerMixin = mixinNotifyDomExit(
  DtChartTooltipContainerBase,
);

@Component({
  selector: 'dt-chart-tooltip-container',
  template: '<ng-template cdkPortalOutlet></ng-template>',
  styleUrls: ['chart-tooltip-container.scss'],
  host: {
    class: 'dt-chart-tooltip-container',
    '[@fade]': '_animationState',
    '(@fade.done)': '_animationDone($event)',
  },
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0 })),
      transition(
        ':enter',
        animate(`${DT_CHART_TOOLTIP_FADE_TIME}ms ease-in-out`),
      ),
      transition(
        ':leave',
        animate(`${DT_CHART_TOOLTIP_FADE_TIME}ms ease-in-out`),
      ),
    ]),
  ],
})
export class DtChartTooltipContainer extends _DtChartTooltipContainerMixin
  implements OnDestroy, CanNotifyOnExit {
  private _destroyed = false;

  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;

  afterClosed = new Subject<void>();

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
    this._notifyDomExit();
  }

  /**
   * Attach a TemplatePortal as content to this dialog container.
   * @param portal Portal to be attached as the dialog content.
   */
  _attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this._portalOutlet.hasAttached()) {
      throw Error('already attached');
    }

    return this._portalOutlet.attachTemplatePortal(portal);
  }

  /** @internal Animation callback. */
  _animationDone(event: AnimationEvent): void {
    const { fromState, toState } = event;

    if ((toState === 'void' && fromState !== 'void') || toState === 'exit') {
      this._notifyDomExit();
      this.afterClosed.next();
      this.afterClosed.complete();
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
    this._animationState = 'void';
  }
}
