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
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import {
  BasePortalOutlet,
  CdkPortalOutlet,
  ComponentPortal,
  TemplatePortal,
} from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  Inject,
  NgZone,
  Optional,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  isDevMode,
} from '@angular/core';

import {
  CanNotifyOnExit,
  DtLogger,
  DtLoggerFactory,
  HasNgZone,
  mixinNotifyDomExit,
} from '@dynatrace/barista-components/core';

const LOG: DtLogger = DtLoggerFactory.create('OverlayContainer');

export const DT_OVERLAY_FADE_TIME = 150;
export const DT_OVERLAY_DELAY = 100;

// Boilerplate for applying mixins to DtOverlayContainer.
export class DtOverlayContainerBase
  extends BasePortalOutlet
  implements HasNgZone
{
  constructor(public _ngZone: NgZone) {
    super();
  }

  /** Part of the PortalOutlet class. */
  attachComponentPortal<T>(_portal: ComponentPortal<T>): ComponentRef<T> {
    throw new Error('Method not implemented.');
  }

  /** Part of the PortalOutlet class. */
  attachTemplatePortal<C>(_portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    throw new Error('Method not implemented.');
  }
}
export const _DtOverlayContainerMixin = mixinNotifyDomExit(
  DtOverlayContainerBase,
);

@Component({
  selector: 'dt-overlay-container',
  exportAs: 'dtOverlayContainer',
  templateUrl: 'overlay-container.html',
  styleUrls: ['overlay-container.scss'],
  host: {
    class: 'dt-overlay-container',
    'attr.aria-hidden': 'true',
    '[@fade]': '_animationState',
    '(@fade.done)': '_animationDone($event)',
  },
  animations: [
    trigger('fade', [
      state('enter', style({ opacity: 1 })),
      transition(
        'void => enter',
        animate(`${DT_OVERLAY_FADE_TIME}ms ${DT_OVERLAY_DELAY}ms ease-in-out`),
      ),
      transition(
        'enter => exit',
        animate(`${DT_OVERLAY_FADE_TIME}ms ease-in-out`),
      ),
    ]),
  ],
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtOverlayContainer
  extends _DtOverlayContainerMixin
  implements CanNotifyOnExit
{
  /** @internal */
  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;

  /** @internal */
  _animationState: 'void' | 'enter' | 'exit' = 'void';

  /** The class that traps and manages focus within the overlay. */
  private _focusTrap: FocusTrap;

  /** Element that was focused before the overlay was opened. Save this to restore upon close. */
  private _elementFocusedBeforeDialogWasOpened: HTMLElement | null = null;

  constructor(
    public _ngZone: NgZone,
    private _elementRef: ElementRef,
    private _focusTrapFactory: FocusTrapFactory,
    private _viewContainerRef: ViewContainerRef,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Optional() @Inject(DOCUMENT) private _document: any,
  ) {
    super(_ngZone);
  }

  /**
   * Attach a ComponentPortal as content to this overlay container.
   */
  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this._portalOutlet.hasAttached()) {
      throw Error('already attached');
    }
    this._animationState = 'enter';
    return this._portalOutlet.attachComponentPortal(portal);
  }

  /**
   * Attach a TemplatePortal as content to this overlay container.
   */
  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this._portalOutlet.hasAttached()) {
      throw Error('already attached');
    }
    this._animationState = 'enter';

    // set the viewcontainerRef manually due to the fact that the portal does not set itself when using a templatePortal
    if (!portal.viewContainerRef) {
      portal.viewContainerRef = this._viewContainerRef;
    }
    return this._portalOutlet.attachTemplatePortal(portal);
  }

  /** triggers the exit animation */
  exit(): void {
    this._animationState = 'exit';
  }

  /** @internal Animation callback */
  _animationDone(event: AnimationEvent): void {
    const { fromState, toState } = event;

    if ((toState === 'void' && fromState !== 'void') || toState === 'exit') {
      this._restoreFocus();
      this._notifyDomExit();
      this._portalOutlet.detach();
    }
  }

  /** @internal Moves the focus inside the focus trap. */
  _trapFocus(): void {
    this._savePreviouslyFocusedElement();
    if (!this._focusTrap) {
      this._focusTrap = this._focusTrapFactory.create(
        this._elementRef.nativeElement,
      );
    }
    this._focusTrap.focusInitialElementWhenReady().catch((error: Error) => {
      if (isDevMode()) {
        LOG.debug('Error when trying to set initial focus', error);
      }
    });
  }

  /** Restores focus to the element that was focused before the overlay opened. */
  private _restoreFocus(): void {
    const toFocus = this._elementFocusedBeforeDialogWasOpened;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    if (toFocus && typeof toFocus.focus === 'function') {
      toFocus.focus();
    }

    if (this._focusTrap) {
      this._focusTrap.destroy();
    }
  }

  /** Saves a reference to the element that was focused before the overlay was opened. */
  private _savePreviouslyFocusedElement(): void {
    if (this._document) {
      this._elementFocusedBeforeDialogWasOpened = this._document
        .activeElement as HTMLElement;

      // Note that there is no focus method when rendering on the server.
      if (this._elementRef.nativeElement.focus) {
        // Move focus onto the dialog immediately in order to prevent the user from accidentally
        // opening multiple dialogs at the same time. Needs to be async, because the element
        // may not be focusable immediately.
        Promise.resolve().then(() => this._elementRef.nativeElement.focus());
      }
    }
  }
}
