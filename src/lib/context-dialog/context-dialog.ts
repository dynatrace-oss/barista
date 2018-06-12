import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, ConnectionPositionPair, CdkOverlayOrigin } from '@angular/cdk/overlay';
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
import { filter, map, takeUntil } from 'rxjs/operators';
import {
  HasTabIndex,
  CanDisable,
  DtLogger,
  DtLoggerFactory,
  mixinTabIndex,
  mixinDisabled,
} from '../core/index';
import { DtContextDialogTrigger} from './context-dialog-trigger';

const LOG: DtLogger = DtLoggerFactory.create('ContextDialogue');
const OVERLAY_POSITIONS = [
  {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top',
  },
  {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'bottom',
  },
];

// Boilerplate for applying mixins to DtContextDialog.
export class DtContextDialogBase { }
export const _DtContextDialogMixinBase = mixinTabIndex(mixinDisabled(DtContextDialogBase));

@Component({
  moduleId: module.id,
  selector: 'dt-context-dialog',
  templateUrl: 'context-dialog.html',
  styleUrls: ['context-dialog.scss'],
  host: {
    'class': 'dt-context-dialog',
    '[class.dt-context-dialog-panel]': 'isPanelOpen',
    '[attr.aria-disabled]': 'disabled.toString()',
    'attr.aria-hidden': 'true',
  },
  inputs: ['disabled', 'tabIndex'],
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtContextDialog extends _DtContextDialogMixinBase
  implements CanDisable, HasTabIndex, OnDestroy, AfterViewInit {
  /** Whether or not the overlay panel is open. */
  private _panelOpen = false;

  /** Last emitted position of the overlay */
  private _lastOverlayPosition: ConnectionPositionPair;

  /** The class that traps and manages focus within the overlay. */
  private _focusTrap: FocusTrap | null;

  /**
   * Element that was focused before the context-dialog was opened.
   * Save this to restore upon close.
   */
  private _elementFocusedBeforeDialogWasOpened: HTMLElement | null = null;

  private  _trigger: CdkOverlayOrigin;

  /** Aria label of the context-dialog. */
  // tslint:disable-next-line:no-input-rename
  @Input('aria-label') ariaLabel = '';

  /** Event emitted when the select has been opened. */
  @Output() readonly openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Overlay pane containing the content */
  @ViewChild(CdkConnectedOverlay) _overlayDir: CdkConnectedOverlay;

  /** Panel that holds the content */
  @ViewChild('panel') _panel: ElementRef;

  @ViewChild(CdkOverlayOrigin) _defaultTrigger: CdkOverlayOrigin;

  /** Whether or not the overlay panel is open. */
  get isPanelOpen(): boolean {
    return this._panelOpen;
  }

  get trigger(): CdkOverlayOrigin | DtContextDialogTrigger {
    return this._trigger;
  }

  get hasCustomTrigger(): boolean {
    return this._trigger && this._trigger !== this._defaultTrigger;
  }

  _positions = OVERLAY_POSITIONS;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _focusTrapFactory: FocusTrapFactory,
    @Attribute('tabindex') tabIndex: string,
    // tslint:disable-next-line: no-any
    @Optional() @Inject(DOCUMENT) private _document: any
  ) {
    super();

    this.tabIndex = parseInt(tabIndex, 10) || 0;
  }

  ngAfterViewInit(): void {
    if (this._defaultTrigger && !this.hasCustomTrigger) {
      this._trigger = this._defaultTrigger;
    }
  }

  open(): void {
    this._setOpen(true);
  }

  close(): void {
    this._setOpen(false);
  }

  private _setOpen(open: boolean): void {
    this._panelOpen = open;
    this.openedChange.emit(open);
    if (this._panelOpen) {
      this._savePreviouslyFocusedElement();
    } else {
      this._restoreFocus();
    }
    this._changeDetectorRef.markForCheck();
  }

  /** Focuses the context-dialog element. */
  focus(): void {
      this.trigger.elementRef.nativeElement.focus();
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
    const toFocus = this._elementFocusedBeforeDialogWasOpened;

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
      this._elementFocusedBeforeDialogWasOpened = this._document.activeElement as HTMLElement;
    }
  }

  _registerTrigger(trigger: DtContextDialogTrigger): void {
    if (this.hasCustomTrigger) {
      LOG.debug('Already has a custom trigger registered');
    }
    this._trigger = trigger;
    this._changeDetectorRef.markForCheck();
  }

  _unregisterTrigger(trigger: DtContextDialogTrigger): void {
    if (this._trigger !== trigger) {
      LOG.debug('Trying to unregister a trigger that is not assigned');
    }
    this._trigger = this._defaultTrigger;
    this._changeDetectorRef.markForCheck();
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
        this.openedChange.pipe(filter((o) => !o))
      ))
      // Map the change event to the provided ConnectionPositionPair
      .pipe(map((change) => change.connectionPair))
      .subscribe((connectionPair) => {
        // Set the classes to indicate the position of the overlay
        if (this._lastOverlayPosition) {
          this._panel.nativeElement.classList
            .remove(`dt-context-dialog-panel-${this._lastOverlayPosition.originY}`);
        }
        this._panel.nativeElement.classList
          .add(`dt-context-dialog-panel-${connectionPair.originY}`);
        this._lastOverlayPosition = connectionPair;
      });
  }

  /** Hook that trigger right before the component will be destroyed. */
  ngOnDestroy(): void {
    if (this._panelOpen) {
      this._restoreFocus();
      this.openedChange.emit(false);
    }
    if (this.hasCustomTrigger) {
      (this._trigger as DtContextDialogTrigger)._unregisterFromDialog();
    }
  }
}
