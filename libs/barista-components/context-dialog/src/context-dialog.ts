/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { ESCAPE } from '@angular/cdk/keycodes';
import {
  CdkOverlayOrigin,
  ConnectedPosition,
  Overlay,
  OverlayRef,
  OverlayConfig,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
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
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  isDevMode,
  InjectionToken,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  CanDisable,
  DtLogger,
  DtLoggerFactory,
  HasTabIndex,
  mixinDisabled,
  mixinTabIndex,
  _readKeyCode,
  DT_UI_TEST_CONFIG,
  DtUiTestConfiguration,
  dtSetUiTestAttribute,
  isDefined,
} from '@dynatrace/barista-components/core';
import { DtContextDialogTrigger } from './context-dialog-trigger';
import { coerceCssPixelValue } from '@angular/cdk/coercion';

/** Controls the sizing of the overlay element within the cdk overlay */
type DtContextDialogOverlayConstraint = {
  maxWidth?: string;
  minWidth?: string;
  width?: string;
  maxHeight?: string;
  minHeight?: string;
  height?: string;
};

const LOG: DtLogger = DtLoggerFactory.create('ContextDialog');
const OVERLAY_POSITIONS: ConnectedPosition[] = [
  {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top',
    panelClass: 'dt-context-dialog-panel-left',
  },
  {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'bottom',
    panelClass: [
      'dt-context-dialog-panel-left',
      'dt-context-dialog-panel-bottom',
    ],
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'top',
    panelClass: 'dt-context-dialog-panel-right',
  },
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'bottom',
    panelClass: [
      'dt-context-dialog-panel-right',
      'dt-context-dialog-panel-bottom',
    ],
  },
];

// Boilerplate for applying mixins to DtContextDialog.
export class DtContextDialogBase {}
export const _DtContextDialogMixinBase = mixinTabIndex(
  mixinDisabled(DtContextDialogBase),
);

export const DT_CONTEXT_DIALOG_CONFIG = new InjectionToken<OverlayConfig>(
  'dt-context-dialog-config',
);

export const _DT_CONTEXT_DIALOG_DEFAULT_CONSTRAINTS = {
  maxWidth: '328px',
};

@Component({
  selector: 'dt-context-dialog',
  templateUrl: 'context-dialog.html',
  styleUrls: ['context-dialog.scss'],
  host: {
    class: 'dt-context-dialog',
    '[attr.aria-disabled]': 'disabled.toString()',
    'attr.aria-hidden': 'true',
  },
  inputs: ['disabled', 'tabIndex'],
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtContextDialog
  extends _DtContextDialogMixinBase
  implements CanDisable, HasTabIndex, OnDestroy, AfterViewInit
{
  /** The class that traps and manages focus within the overlay. */
  private _focusTrap: FocusTrap | null;

  /**
   * Element that was focused before the context-dialog was opened.
   * Save this to restore upon close.
   */
  private _elementFocusedBeforeDialogWasOpened: HTMLElement | null = null;

  private _trigger: CdkOverlayOrigin;

  private _overlayRef: OverlayRef | null;

  private _destroy = new Subject<void>();

  /** Aria label of the context-dialog. */
  @Input('aria-label') ariaLabel: string;
  /** Aria reference to a label describing the context-dialog. */
  @Input('aria-labelledby') ariaLabelledBy: string;

  /** Aria label of the context-dialog's close button. */
  @Input()
  get ariaLabelClose(): string {
    return this._ariaLabelClose;
  }
  set ariaLabelClose(value: string) {
    this._ariaLabelClose = value;
  }
  /** @internal Aria label of the context-dialog's close button. */
  _ariaLabelClose: string;

  /** The custom class to add to the overlay panel element. Can be used to scope styling within the overlay */
  @Input() overlayPanelClass:
    | string
    | string[]
    | Set<string>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | { [key: string]: any };

  /** Event emitted when the select has been opened. */
  @Output()
  readonly openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** @internal Panel that holds the content */
  @ViewChild('panel') _panel: ElementRef;

  /** @internal Reference to the overlay template. */
  @ViewChild(TemplateRef, { static: true }) _overlayTemplate: TemplateRef<void>;

  /** @internal Reference to the overlay origin. */
  @ViewChild(CdkOverlayOrigin)
  _defaultTrigger: CdkOverlayOrigin;

  /** Whether or not the overlay panel is open. */
  get isPanelOpen(): boolean {
    return !!this._overlayRef;
  }

  /** Returns the trigger that is currently attached with context dialog */
  get trigger(): CdkOverlayOrigin | DtContextDialogTrigger {
    return this._trigger;
  }

  /** Whether a context dialog has a custom trigger attached */
  get hasCustomTrigger(): boolean {
    return this._trigger && this._trigger !== this._defaultTrigger;
  }

  _overlayConstraints: DtContextDialogOverlayConstraint =
    _DT_CONTEXT_DIALOG_DEFAULT_CONSTRAINTS;

  constructor(
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private _changeDetectorRef: ChangeDetectorRef,
    private _focusTrapFactory: FocusTrapFactory,
    private _elementRef: ElementRef<HTMLElement>,
    @Attribute('tabindex') tabIndex: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Optional() @Inject(DOCUMENT) private _document: any,
    @Optional()
    @Inject(DT_UI_TEST_CONFIG)
    private _config?: DtUiTestConfiguration,
    @Optional()
    @Inject(DT_CONTEXT_DIALOG_CONFIG)
    private _userConfig?: OverlayConfig,
  ) {
    super();
    this.tabIndex = parseInt(tabIndex, 10) || 0;

    if (this._userConfig) {
      const customConstraints: DtContextDialogOverlayConstraint = {
        maxWidth: isDefined(this._userConfig.maxWidth)
          ? coerceCssPixelValue(this._userConfig.maxWidth)
          : undefined,
        minWidth: isDefined(this._userConfig.minWidth)
          ? coerceCssPixelValue(this._userConfig.minWidth)
          : undefined,
        width: isDefined(this._userConfig.width)
          ? coerceCssPixelValue(this._userConfig.width)
          : undefined,
        maxHeight: isDefined(this._userConfig.maxHeight)
          ? coerceCssPixelValue(this._userConfig.maxHeight)
          : undefined,
        minHeight: isDefined(this._userConfig.minHeight)
          ? coerceCssPixelValue(this._userConfig.minHeight)
          : undefined,
        height: isDefined(this._userConfig.height)
          ? coerceCssPixelValue(this._userConfig.height)
          : undefined,
      };

      this._overlayConstraints = {
        ..._DT_CONTEXT_DIALOG_DEFAULT_CONSTRAINTS,
        ...JSON.parse(JSON.stringify(customConstraints)),
      };
    }
  }

  ngAfterViewInit(): void {
    if (this._defaultTrigger && !this.hasCustomTrigger) {
      this._trigger = this._defaultTrigger;
    }
  }

  /** Hook that trigger right before the component will be destroyed. */
  ngOnDestroy(): void {
    if (this._overlayRef) {
      this._restoreFocus();
      this._overlayRef.dispose();
    }
    if (this.hasCustomTrigger) {
      (this._trigger as DtContextDialogTrigger)._unregisterFromDialog();
    }
    this._destroy.next();
    this._destroy.complete();
  }

  /** Opens the context dialog */
  open(): void {
    if (!this.disabled && !this._overlayRef) {
      this._savePreviouslyFocusedElement();
      this._createOverlay();
      this.openedChange.emit(true);
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Closes the context dialog */
  close(): void {
    if (this._overlayRef) {
      this._overlayRef.detach();
      this._overlayRef = null;
      this._restoreFocus();
      this.openedChange.emit(false);
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Focuses the context-dialog element. */
  focus(): void {
    this.trigger.elementRef.nativeElement.focus();
  }

  /** Moves the focus inside the focus trap. */
  private _trapFocus(): void {
    if (!this._focusTrap && this._overlayRef) {
      this._focusTrap = this._focusTrapFactory.create(
        this._overlayRef.overlayElement,
      );
      this._focusTrap
        .focusFirstTabbableElementWhenReady()
        .catch((error: Error) => {
          if (isDevMode()) {
            LOG.debug('Error when trying to set initial focus', error);
          }
        });
    }
  }

  /** Restores focus to the element that was focused before the overlay opened. */
  private _restoreFocus(): void {
    const toFocus = this._elementFocusedBeforeDialogWasOpened;

    // We need the extra check, because IE can set the `activeElement` to null in some cases.
    // eslint-disable-next-line @typescript-eslint/unbound-method
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
      this._elementFocusedBeforeDialogWasOpened = this._document
        .activeElement as HTMLElement;
    }
  }

  private _createOverlay(): void {
    const defaultConfig: OverlayConfig = {
      scrollStrategy: this._overlay.scrollStrategies.block(),
      backdropClass: 'cdk-overlay-transparent-backdrop',
      hasBackdrop: true,
    };

    const overlayConfig = this._userConfig
      ? { ...defaultConfig, ...this._userConfig }
      : defaultConfig;

    const positionStrategy = this._overlay
      .position()
      .flexibleConnectedTo(this._trigger.elementRef)
      .withPositions(OVERLAY_POSITIONS)
      .setOrigin(this._trigger.elementRef)
      .withFlexibleDimensions(true)
      .withPush(false)
      .withGrowAfterOpen(false)
      .withViewportMargin(0)
      .withLockedPosition(false);

    overlayConfig.positionStrategy = positionStrategy;
    /**
     * Remove the constraint properties from the config passed to the overlay create
     * method since setting one of these properties disables the flexibleDimensions and we
     * actually want that to still be the case.
     */
    const {
      width,
      height,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      ...remainingConfig
    } = overlayConfig;
    this._overlayRef = this._overlay.create(remainingConfig);

    dtSetUiTestAttribute(
      this._overlayRef.overlayElement,
      this._overlayRef.overlayElement.id,
      this._elementRef,
      this._config,
    );

    this._overlayRef
      .backdropClick()
      .pipe(takeUntil(this._destroy))
      .subscribe(() => {
        this.close();
      });
    this._overlayRef.attach(
      new TemplatePortal(this._overlayTemplate, this._viewContainerRef),
    );
    this._trapFocus();

    this._overlayRef
      .keydownEvents()
      .pipe(takeUntil(this._destroy))
      .subscribe((event: KeyboardEvent) => {
        if (_readKeyCode(event) === ESCAPE && this._overlayRef) {
          this.close();
        }
      });
  }

  /** @internal Registers a trigger for this context dialog. */
  _registerTrigger(trigger: DtContextDialogTrigger): void {
    if (this.hasCustomTrigger) {
      LOG.debug('Already has a custom trigger registered');
    }
    this._trigger = trigger;
    this._changeDetectorRef.markForCheck();
  }

  /** @internal Unregisters a previously registered trigger for this context dialog. */
  _unregisterTrigger(trigger: DtContextDialogTrigger): void {
    if (this._trigger !== trigger) {
      LOG.debug('Trying to unregister a trigger that is not assigned');
    }
    this._trigger = this._defaultTrigger;
    this.close();
    this._changeDetectorRef.markForCheck();
  }
}
