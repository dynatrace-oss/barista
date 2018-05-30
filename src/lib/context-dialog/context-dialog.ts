import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, ConnectionPositionPair, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
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
import { filter, map, takeUntil } from 'rxjs/operators';
import {
  CanDisable,
  DtLogger,
  DtLoggerFactory,
} from '../core/index';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

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

@Directive({
  selector: 'button[dtContextDialogTrigger]',
  exportAs: 'dtContextDialogTrigger',
  inputs: ['disabled'],
  host: {
    'class': 'dt-context-dialog-trigger',
    '[attr.aria-disabled]': '_disabled.toString()',
    '(click)': 'dialog && dialog.open()',
  },
})
export class DtContextDialogTrigger extends CdkOverlayOrigin implements CanDisable, OnDestroy {

  private _dialog: DtContextDialog | undefined;
  private _disabled = false;

  @Input('dtContextDialogTrigger')
  get dialog(): DtContextDialog | undefined { return this._dialog; }
  set dialog(value: DtContextDialog | undefined) {
    if (value !== this._dialog) {
      this._unregisterFromDialog();
      if (value) {
        value._registerTrigger(this);
      }
      this._dialog = value;
    }
  }

  @Output() readonly openChange = new EventEmitter<void>();

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  ngOnDestroy(): void {
    this._unregisterFromDialog();
  }

  _unregisterFromDialog(): void {
    if (this._dialog) {
      this._dialog._unregisterTrigger(this);
      this._dialog = undefined;
    }
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
}

@Component({
  moduleId: module.id,
  selector: 'dt-context-dialog',
  templateUrl: 'context-dialog.html',
  styleUrls: ['context-dialog.scss'],
  host: {
    'class': 'dt-context-dialog',
    '[class.dt-context-dialog-panel]': 'opened',
    'attr.aria-hidden': 'true',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtContextDialog implements OnDestroy {
  /** Whether or not the overlay panel is open. */
  private _opened = false;

  /** Last emitted position of the overlay */
  private _lastOverlayPosition: ConnectionPositionPair;

  /** The class that traps and manages focus within the overlay. */
  private _focusTrap: FocusTrap | null;

  /**
   * Element that was focused before the context-dialog was opened.
   * Save this to restore upon close.
   */
  private _elementFocusedBeforeDialogWasOpened: HTMLElement | null = null;

  private  _trigger: DtContextDialogTrigger | undefined = undefined;

  /** Aria label of the context-dialog. */
  // tslint:disable-next-line:no-input-rename
  @Input('aria-label') ariaLabel = '';

  /** Event emitted when the select has been opened. */
  @Output() readonly openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Overlay pane containing the content */
  @ViewChild(CdkConnectedOverlay) _overlayDir: CdkConnectedOverlay;

  /** Panel that holds the content */
  @ViewChild('panel') _panel: ElementRef;

  @ViewChild(DtContextDialogTrigger) _defaultTrigger: DtContextDialogTrigger;

  /** Whether or not the overlay panel is open. */
  get isPanelOpen(): boolean {
    return this._opened;
  }

  get trigger(): DtContextDialogTrigger | undefined {
    return this._trigger;
  }

  // get hasCustomTrigger(): boolean {
  //   return this._trigger;
  // }
  _positions = OVERLAY_POSITIONS;

  constructor(
    private _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    private _focusTrapFactory: FocusTrapFactory,
    // tslint:disable-next-line: no-any
    @Optional() @Inject(DOCUMENT) private _document: any
  ) {}

  @Input()
  // @HostBinding('class.dt-context-dialog-panel')
  get opened(): boolean { return this._opened; }
  set opened(value: boolean) { this._opened = coerceBooleanProperty(value); }

  toggle(): boolean {
    this._openClose(!this._opened);
    return this.opened;
  }

  open(): void {
    this._openClose(true);
  }

  close(): void {
    this._openClose(false);
  }

  private _openClose(open: boolean): void {
    this._opened = open;
    this.openedChange.emit(open);
    if (this._opened) {
      this._savePreviouslyFocusedElement();
    } else {
      this._restoreFocus();
    }
    this._changeDetectorRef.detectChanges();
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

  _registerTrigger(trigger: DtContextDialogTrigger): void {
    if (trigger !== this._defaultTrigger && this._trigger === this._defaultTrigger) {
        // TODO assign default trigger
    }
    // if (this.trigger) {
     // LOG.debug('Trying to register', Error);
    // }
    this._trigger = trigger;
  }

  _unregisterTrigger(trigger: DtContextDialogTrigger): void {
    if (this._trigger !== trigger) {
      LOG.debug('Trying to unregister a trigger that is not assigned', Error);
    }
    this._trigger = trigger;
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
