import {
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ComponentRef,
  EmbeddedViewRef,
  Component,
  ViewChild,
  NgZone,
  Optional,
  Inject,
  ElementRef,
  isDevMode,
  ViewContainerRef,
} from '@angular/core';
import { BasePortalOutlet, ComponentPortal, CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';
import { Subject } from 'rxjs';
import { HasNgZone, mixinNotifyDomExit, CanNotifyOnExit, DtLoggerFactory, DtLogger } from '@dynatrace/angular-components/core';
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { DtOverlayConfig } from './overlay-config';

const LOG: DtLogger = DtLoggerFactory.create('OverlayContainer');

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
export const _DtOverlayContainerMixin = mixinNotifyDomExit(DtOverlayContainerBase);

@Component({
  moduleId: module.id,
  selector: 'dt-overlay-container',
  exportAs: 'dtOverlayContainer',
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
export class DtOverlayContainer extends _DtOverlayContainerMixin implements CanNotifyOnExit {

  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;

  _animationState = 'void';

  readonly _onExit: Subject<void> = new Subject();

  /** The class that traps and manages focus within the overlay. */
  private _focusTrap: FocusTrap;

  /** Element that was focused before the overlay was opened. Save this to restore upon close. */
  private _elementFocusedBeforeDialogWasOpened: HTMLElement | null = null;

  constructor(
    public _ngZone: NgZone,
    private _elementRef: ElementRef,
    private _focusTrapFactory: FocusTrapFactory,
    private _viewContainerRef: ViewContainerRef,
    // tslint:disable-next-line:no-any
    @Optional() @Inject(DOCUMENT) private _document: any,
    public _config: DtOverlayConfig) {
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

  /** Animation callback */
  _animationDone(event: AnimationEvent): void {
    const {fromState, toState} = event;

    if ((toState === 'void' && fromState !== 'void') || toState === 'exit') {
      this._restoreFocus();
      this._notifyDomExit();
    }
  }

  /** Moves the focus inside the focus trap. */
  _trapFocus(): void {
    this._savePreviouslyFocusedElement();
    if (!this._focusTrap) {
      this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
    }
    this._focusTrap.focusInitialElementWhenReady()
    .catch((error: Error) => {
      if (isDevMode()) {
        LOG.debug('Error when trying to set initial focus', error);
      }
    });
  }

  /** Restores focus to the element that was focused before the overlay opened. */
  private _restoreFocus(): void {
    const toFocus = this._elementFocusedBeforeDialogWasOpened;

    // tslint:disable-next-line: strict-type-predicates no-unbound-method
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
      this._elementFocusedBeforeDialogWasOpened = this._document.activeElement as HTMLElement;
    }
  }
}
