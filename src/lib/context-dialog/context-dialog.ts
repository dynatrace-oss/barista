import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, ConnectionPositionPair } from '@angular/cdk/overlay';
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
} from '@angular/core';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { takeUntil } from 'rxjs/operators/takeUntil';
import {
  CanColor, CanDisable,
  DtLogger, DtLoggerFactory,
  HasTabIndex,
  mixinColor, mixinDisabled, mixinTabIndex
} from '../core/index';

const LOG: DtLogger = DtLoggerFactory.create('ContextDialogue');

// Boilerplate for applying mixins to DtContextDialog.
export class DtContextDialogBase {
  constructor(public _elementRef: ElementRef) { }
}
export const _DtContextDialogBase =
  mixinTabIndex(mixinDisabled(mixinColor(DtContextDialogBase)));

@Component({
  moduleId: module.id,
  selector: 'dt-context-dialog',
  templateUrl: 'context-dialog.html',
  styleUrls: ['context-dialog.scss'],
  inputs: ['disabled', 'tabIndex', 'color'],
  host: {
    'class': 'dt-context-dialog',
    'attr.aria-hidden': 'true',
    '[attr.aria-disabled]': 'disabled.toString()',
    'tabIndex': '-1',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtContextDialog extends _DtContextDialogBase
implements OnDestroy, HasTabIndex, CanDisable, CanColor {
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

  /** Aria label of the context-dialog. */
  // tslint:disable-next-line:no-input-rename
  @Input('aria-label') ariaLabel = '';

  /** Event emitted when the select has been opened. */
  @Output() readonly openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  _positions = [
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

  /** Overlay pane containing the content */
  @ViewChild(CdkConnectedOverlay) _overlayDir: CdkConnectedOverlay;

  /** Panel that holds the content */
  @ViewChild('panel') _panel: ElementRef;

  /** Whether or not the overlay panel is open. */
  get isPanelOpen(): boolean {
    return this._panelOpen;
  }

  constructor(
    elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    private _focusTrapFactory: FocusTrapFactory,
    @Attribute('tabindex') tabIndex: string,
    // tslint:disable-next-line: no-any
    @Optional() @Inject(DOCUMENT) private _document: any
  ) {
    super(elementRef);

    this.tabIndex = parseInt(tabIndex, 10) || 0;
  }

  /** Opens the panel */
  open(): void {
    if (!this.disabled && !this._panelOpen) {
      this._panelOpen = true;
      this.openedChange.emit(true);
      this._savePreviouslyFocusedElement();
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Closes the panel */
  close(): void {
    if (this._panelOpen) {
      this._panelOpen = false;
      this.openedChange.emit(false);
      this._restoreFocus();
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Focuses the context-dialog element. */
  focus(): void {
    this._elementRef.nativeElement.focus();
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
    this.close();
  }
}
