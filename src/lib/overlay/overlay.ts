import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, ConnectionPositionPair, FlexibleConnectedPositionStrategy, ScrollStrategy, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Output,
  ViewChild,
  ViewEncapsulation,
  isDevMode,
  AfterViewInit,
} from '@angular/core';
import { Observable, Subject, fromEvent } from 'rxjs';
import { debounceTime, filter, map, switchMap, switchMapTo, startWith, takeUntil } from 'rxjs/operators';
import {
  HasTabIndex,
  CanDisable,
  DtLogger,
  DtLoggerFactory,
  mixinTabIndex,
  mixinDisabled,
} from '../core/index';
import { DtOverlayTrigger} from './overlay-trigger';
import { AreaClickEvent } from 'highcharts';
import { LIFECYCLE_HOOKS_VALUES } from '@angular/compiler/src/lifecycle_reflector';
import { DtOverlayConfigInterface } from './overlay-config-model'

const LOG: DtLogger = DtLoggerFactory.create('Overlay');
const OVERLAY_POSITIONS = [
  {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    // offsetX: -25,
    // offsetY: 0,
  },
  {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'bottom',
  },
];

// Boilerplate for applying mixins to DtOverlay.
export class DtOverlayBase { }
export const _DtOverlayMixinBase = mixinTabIndex(mixinDisabled(DtOverlayBase));

@Component({
  moduleId: module.id,
  selector: 'dt-overlay',
  templateUrl: 'overlay.html',
  styleUrls: ['overlay.scss'],
  host: {
    'class': 'dt-overlay',
    'attr.aria-hidden': 'true',
  },
  inputs: ['tabIndex'],
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtOverlay extends _DtOverlayMixinBase
  implements CanDisable, HasTabIndex, OnDestroy, AfterViewInit {
  /** Whether or not the overlay panel is open. */
  private _panelOpen = false;

  private _config: DtOverlayConfigInterface;

  private _stay = false;

  /** Last emitted position of the overlay */
  private _lastOverlayPosition: ConnectionPositionPair;

  /** The class that traps and manages focus within the overlay. */
  private _focusTrap: FocusTrap | null;

  /**
   * Element that was focused before the overlay was opened.
   * Save this to restore upon close.
   */
  private _elementFocusedBeforeOverlayWasOpened: HTMLElement | null = null;

  private  _trigger: CdkOverlayOrigin;

  /** Aria label of the overlay. */
  // tslint:disable-next-line:no-input-rename
  @Input('aria-label') ariaLabel = '';

  /** Event emitted when the select has been opened. */
  @Output() readonly visibilityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Overlay pane containing the content */
  @ViewChild(CdkConnectedOverlay) _overlayDir: CdkConnectedOverlay;

  /** Panel that holds the content */
  @ViewChild('panel') _panel: ElementRef;

  @ViewChild(CdkOverlayOrigin) _defaultTrigger: CdkOverlayOrigin;

  /** Whether or not the overlay panel is open. */
  get isPanelOpen(): boolean {
    return this._panelOpen;
  }

  get trigger(): CdkOverlayOrigin | DtOverlayTrigger {
    return this._trigger;
  }

  get hasCustomTrigger(): boolean {
    return this._trigger && this._trigger !== this._defaultTrigger;
  }

  public setConfig(config: DtOverlayConfigInterface): void {
    this._config = config;
  }

  public getConfig(): DtOverlayConfigInterface {
    return this._config
  }

  _positions = OVERLAY_POSITIONS;

  // public repPos: ScrollStrategy;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _focusTrapFactory: FocusTrapFactory,
    // private _flexibleConnectedPositionStrategy: FlexibleConnectedPositionStrategy,

    @Attribute('tabindex') tabIndex: string,
    // tslint:disable-next-line: no-any
    @Optional() @Inject(DOCUMENT) private _document: any
  ) {
    super();

    // this._flexibleConnectedPositionStrategy.withLockedPosition(true);
    this.tabIndex = parseInt(tabIndex, 10) || 0;

    // this._positions = [{
    //   originX: 'start',
    //   originY: 'top',
    //   overlayX: 'end',
    //   overlayY: 'bottom',
    // }]

    // this.repPos = {
    //   enable: () => {},
    //   disable: () => {},
    //   attach: (value) => { console.log('attach'); }
    // };
    // this.repPos.attach(this._overlayDir.overlayRef)
    // this.repPos.enable()
  }

  private _setFocus() {
    if (this._panelOpen && !this._stay) {
      this._savePreviouslyFocusedElement();
    } else if (this._panelOpen && this._stay) {
      this._savePreviouslyFocusedElement();

      this._overlayDir.overlayRef.overlayElement.setAttribute('tabindex', '0')
      this._overlayDir.overlayRef.overlayElement.focus()
      this._overlayDir.overlayRef.overlayElement.addEventListener('blur', () => this.close(), {once: true, passive: true})
    } else {
      this._restoreFocus();
    }
  }

  private _setOpen(open: boolean): void {
    this._panelOpen = open;
    this.visibilityChanged.emit(open);
    this._changeDetectorRef.markForCheck();
  }

  /** Moves the focus inside the focus trap. */
  private _trapFocus(): void {
    if (!this._focusTrap) {
      this._focusTrap = this._focusTrapFactory.create(this._overlayDir.overlayRef.overlayElement);
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
    const toFocus = this._elementFocusedBeforeOverlayWasOpened;

    // We need the extra check, because IE can set the `activeElement` to null in some cases.
    // tslint:disable-next-line: strict-type-predicates no-unbound-method
    if (toFocus && typeof toFocus.focus === 'function') {
      toFocus.focus();
    }

    if (this._focusTrap) {
      /** Destroy the focus trap */
      this._focusTrap.destroy();
      /** reset the focus trap to null to create a new one on subsequent open calls */
      this._focusTrap = null;
    }
  }

  /** Saves a reference to the element that was focused before the overlay was opened. */
  private _savePreviouslyFocusedElement(): void {
    if (this._document) {
      this._elementFocusedBeforeOverlayWasOpened = this._document.activeElement as HTMLElement;
    }
  }

  /** Callback that is invoked when the overlay panel has been attached. */
  _onAttached(): void {
    /** trap focus within the overlay */
    this._trapFocus();

    const positionChange = this._overlayDir.positionChange;

    // Set classes depending on the position of the overlay
    positionChange
      // Stop listening when the component will be destroyed
      // or the overlay closes
      .pipe(takeUntil(
        this.visibilityChanged.pipe(filter((o) => !o))
      ))
      // Map the change event to the provided ConnectionPositionPair
      .pipe(map((change) => change.connectionPair))
      .subscribe((connectionPair) => {
        // Set the classes to indicate the position of the overlay
        if (this._lastOverlayPosition) {
          this._panel.nativeElement.classList
            .remove(`dt-overlay-panel-${this._lastOverlayPosition.originY}`);
        }
        this._panel.nativeElement.classList
          .add(`dt-overlay-panel-${connectionPair.originY}`);
        this._lastOverlayPosition = connectionPair;
      });
  }

  public registerTrigger(trigger: DtOverlayTrigger): void {
    if (this.hasCustomTrigger) {
      LOG.debug('Already has a custom trigger registered');
    }
    this._trigger = trigger;
    this._changeDetectorRef.markForCheck();
  }

  public unregisterTrigger(trigger: DtOverlayTrigger): void {
    if (this._trigger !== trigger) {
      LOG.debug('Trying to unregister a trigger that is not assigned');
    }
    this._trigger = this._defaultTrigger;
    this._changeDetectorRef.markForCheck();
  }

  public appear(): void {
    console.log('overlayConfig', this._config)
    this._setOpen(true);
  }

  public stay(): void {
    // if(this._config.enableClick) {
      this._stay = true;
      this._setFocus();
    // }
  }

  public close(): void {
    this._stay = false;
    this._setOpen(false);
    this._setFocus()
  }

  public closeOnHoverOut(): void {
    if(!this._stay) {
      this.close()
    }
  }

  // using "HTMLElement" type as MouseEvent interface doesn't have the target property
  public move(event: MouseEvent): void {
    const offsetWidth = this._trigger.elementRef.nativeElement.offsetWidth
    const triggerWidth = Math.floor(offsetWidth / 2);
    this._overlayDir.offsetX = -(triggerWidth - event.offsetX) + 10;
    this._overlayDir.overlayRef.updatePosition();
    this._changeDetectorRef.markForCheck();
  }

  ngAfterViewInit(): void {
    if (this._defaultTrigger && !this.hasCustomTrigger) {
      this._trigger = this._defaultTrigger;
    }
  }

  /** Hook that trigger right before the component will be destroyed. */
  ngOnDestroy(): void {
    if (this._panelOpen) {
      this._restoreFocus();
      this.visibilityChanged.emit(false);
    }
    if (this.hasCustomTrigger) {
      (this._trigger as DtOverlayTrigger)._unregisterFromOverlay();
    }
  }
}
