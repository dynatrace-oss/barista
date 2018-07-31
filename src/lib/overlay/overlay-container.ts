import {
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ComponentRef,
  EmbeddedViewRef,
  Component,
  ViewChild,
  NgZone,
} from '@angular/core';
import { BasePortalOutlet, ComponentPortal, CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';
import { Subject } from 'rxjs';
import { HasNgZone, mixinMicrotaskEmpty } from '@dynatrace/angular-components/core';

export const DT_OVERLAY_FADE_TIME = 150;
export const DT_OVERLAY_DELAY = 100;

// Boilerplate for applying mixins to DtOverlayContainer.
export class DtOverlayContainerBase extends BasePortalOutlet implements HasNgZone {
  constructor(public _ngZone: NgZone) {
    super();
  }
  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    throw new Error('Method not implemented.');
  }
  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    throw new Error('Method not implemented.');
  }
}
export const _DtOverlayContainerMixin = mixinMicrotaskEmpty(DtOverlayContainerBase);

@Component({
  moduleId: module.id,
  selector: 'dt-overlay-container',
  templateUrl: 'overlay-container.html',
  styleUrls: ['overlay-container.scss'],
  host: {
    'class': 'dt-overlay-container',
    'attr.aria-hidden': 'true',
    '[@fade]': '_animationState',
    '(@fade.done)': '_animationDone($event)',
  },
  animations: [
    trigger('fade', [
      state('enter', style({opacity: 1})),
      transition('void => enter', animate(`${DT_OVERLAY_FADE_TIME}ms ${DT_OVERLAY_DELAY}ms ease-in-out`)),
      transition('enter => exit', animate(`${DT_OVERLAY_FADE_TIME}ms ease-in-out`)),
    ]),
  ],
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtOverlayContainer extends _DtOverlayContainerMixin {
  @ViewChild(CdkPortalOutlet) _portalOutlet: CdkPortalOutlet;

  _animationState = 'void';

  readonly _onExit: Subject<void> = new Subject();

  constructor(public _ngZone: NgZone) {
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
    return this._portalOutlet.attachTemplatePortal(portal);
  }

  /** triggers the exit animation */
  exit(): void {
    this._animationState = 'exit';
  }

  /** Animation callback */
  _animationDone(event: AnimationEvent): void {
    const {fromState, toState} = event;

    if ((toState === 'void' && fromState !== 'void') || toState === 'exit') {
      this._safeExit();
    }
  }
}
