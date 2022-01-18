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

import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  OnDestroy,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  isDevMode,
  Optional,
  Inject,
  ElementRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import {
  DtLogger,
  DtLoggerFactory,
  DtUiTestConfiguration,
  dtSetUiTestAttribute,
  DT_UI_TEST_CONFIG,
  DtViewportResizer,
} from '@dynatrace/barista-components/core';

import {
  DT_CONFIRMATION_BACKDROP_ACTIVE_OPACITY,
  DT_CONFIRMATION_POP_DURATION,
} from './confirmation-dialog-constants';
import { DtConfirmationDialogState } from './confirmation-dialog-state/confirmation-dialog-state';

const LOG: DtLogger = DtLoggerFactory.create('DtConfirmationDialog');

@Component({
  templateUrl: './confirmation-dialog.html',
  styleUrls: ['./confirmation-dialog.scss'],
  selector: 'dt-confirmation-dialog',
  exportAs: 'dtConfirmationDialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  host: {
    class: 'dt-confirmation-dialog',
  },
  animations: [
    trigger('pop', [
      state(
        'up',
        style({
          transform: 'translateY(0)',
        }),
      ),
      state(
        'down',
        style({
          transform: 'translateY(100%)',
        }),
      ),
      transition('up => down', [
        animate(`${DT_CONFIRMATION_POP_DURATION}ms ease`),
      ]),
      transition('down => up', [
        animate(`${DT_CONFIRMATION_POP_DURATION}ms ease`),
      ]),
    ]),
    trigger('wiggle', [
      transition(
        'false => true',
        animate(
          '400ms',
          keyframes([
            style({ transform: 'translateX(-4px)', offset: 0.2 }),
            style({ transform: 'translateX( 3px)', offset: 0.4 }),
            style({ transform: 'translateX(-2px)', offset: 0.6 }),
            style({ transform: 'translateX( 1px)', offset: 0.8 }),
          ]),
        ),
      ),
    ]),
  ],
})
export class DtConfirmationDialog
  implements AfterContentChecked, AfterContentInit, OnDestroy
{
  /** Input for the aria-label on the confirmation dialog */
  @Input('aria-label') ariaLabel: string;
  /** Aria reference to a label describing the confirmation dialog */
  @Input('aria-labelledby') ariaLabelledBy: string;

  /** Show a backdrop covering all page functionality except the confirmation dialog. */
  @Input()
  get showBackdrop(): boolean {
    return this._showBackdrop;
  }
  set showBackdrop(value: boolean) {
    this._showBackdrop = coerceBooleanProperty(value);
    this._updateBackdropVisibility();
  }
  static ngAcceptInputType_showBackdrop: BooleanInput;

  /** Input for the current state of confirmation dialog, corresponding to which dt-confirmation-dialog state child to display. */
  @Input()
  get state(): string | null {
    return this._selectedState;
  }
  set state(value: string | null) {
    this._stateToSelect = value;
  }
  /** Holds the currently selected state */
  private _selectedState: string | null = null;

  /** Holds the next state that needs to be selected */
  private _stateToSelect: string | null = null;

  /** The template that will become the overlay. */
  @ViewChild(TemplateRef, { static: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _templateRef: TemplateRef<any>;
  /** All the "state" child elements. */
  @ContentChildren(DtConfirmationDialogState)
  private readonly _stateChildren: QueryList<DtConfirmationDialogState>;
  /** A static reference to the currently active dialog to prevent multiple */
  private static _activeDialog: DtConfirmationDialog | null = null;
  private _overlayRef: OverlayRef | null = null;
  private _showBackdrop = false;
  private _stateChildrenSubscription: Subscription = Subscription.EMPTY;
  private _viewportChangesSubscription: Subscription = Subscription.EMPTY;

  /** @internal holds the state for the wiggle animation */
  _wiggleState = false;

  /** @internal holds the current position state for the animation */
  _positionState: 'down' | 'up' = 'down';

  constructor(
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>,
    private _viewportResizer: DtViewportResizer,
    @Optional()
    @Inject(DT_UI_TEST_CONFIG)
    private _config?: DtUiTestConfiguration,
  ) {}

  ngAfterContentChecked(): void {
    // Initally we get undefined and null for selectedState and stateToSelect which would not pass
    // the equal check. Therefore we need to check whether one of them is defined to not
    // create the overlay instantly on the first run
    if (
      this._selectedState !== this._stateToSelect &&
      (this._stateToSelect || this._selectedState)
    ) {
      this._update();
      this._selectedState = this._stateToSelect;
    }
  }

  ngAfterContentInit(): void {
    this._stateChildrenSubscription = this._stateChildren.changes.subscribe(
      () => {
        this._update();
      },
    );
  }

  ngOnDestroy(): void {
    // if this is the active dialog, set it to null
    if (DtConfirmationDialog._activeDialog === this) {
      DtConfirmationDialog._activeDialog = null;
    }
    // clear state and dispose overlay.
    this.state = null;
    this._overlayRef?.dispose();
    this._stateChildrenSubscription.unsubscribe();
    this._viewportChangesSubscription.unsubscribe();
  }

  /** Triggers an animation on the confirmation dialog to focus user attention */
  focusAttention(): void {
    this._wiggleState = true;
    this._changeDetectorRef.markForCheck();
  }

  /** @internal Callback for the animation done on the pop animation */
  _popDone(): void {
    if (this._positionState === 'down') {
      this._overlayRef?.detach();
      this._overlayRef = null;
    }
  }

  /** Updates the children's active properties and the position of the dialog depending on the state to select */
  private _update(): void {
    if (!this._overlayRef) {
      this._createAndAttachOverlay();
      this._updateBackdropVisibility();
    }
    // handle old dialog already being displayed by closing it and showing a warning in dev mode.
    if (this._stateToSelect) {
      if (
        DtConfirmationDialog._activeDialog &&
        DtConfirmationDialog._activeDialog !== this
      ) {
        DtConfirmationDialog._activeDialog.state = null;
        DtConfirmationDialog._activeDialog._update();
        if (isDevMode()) {
          LOG.warn(
            'A DtConfirmationDialog was already active and was automatically dismissed.',
          );
        }
      }
      DtConfirmationDialog._activeDialog = this;
    }
    // We need to defer this to the next cycle to avoid expression changed after checked errors
    Promise.resolve().then(() => {
      this._stateChildren.forEach((child) => {
        child._updateActive(this._stateToSelect === child.name);
      });
      if (this._stateChildren.some((child) => child._isActive)) {
        this._positionState = 'up';
        DtConfirmationDialog._activeDialog = this;
      } else {
        this._positionState = 'down';
        // Unmark this dialog as the _activeDialog if dismissed
        if (DtConfirmationDialog._activeDialog === this) {
          DtConfirmationDialog._activeDialog = null;
        }
      }
      this._changeDetectorRef.markForCheck();
    });
  }

  /**
   * @internal
   * Update the visibilty (opacity, pointer-events) of the backdrop
   */
  private _updateBackdropVisibility(): void {
    if (this._overlayRef && this._overlayRef.backdropElement) {
      if (this._showBackdrop) {
        this._overlayRef.backdropElement.style.opacity =
          DT_CONFIRMATION_BACKDROP_ACTIVE_OPACITY;
        this._overlayRef.backdropElement.style.pointerEvents = 'auto';
      } else {
        this._overlayRef.backdropElement.style.opacity = '0';
        this._overlayRef.backdropElement.style.pointerEvents = 'none';
      }
    }
  }

  /** Creates and attaches the overlay to the dom */
  private _createAndAttachOverlay(): void {
    this._viewportChangesSubscription.unsubscribe();

    const offsetLeft = this._viewportResizer.getOffset().left;
    const positionStrategy = this._overlay
      .position()
      .global()
      .left(`${offsetLeft}px`)
      .bottom('0px');

    const overlayRef = this._overlay.create({
      ...{
        hasBackdrop: true,
        backdropClass: 'confirmation-dialog-backdrop',
        panelClass: 'dt-confirmation-dialog-content',
        // if the width is set to 100% the global positionstrategy will ignore any left offset
        // specified in the position strategy - therefore we need to use calc for the width
        width: getOverlayWidth(offsetLeft),
      },
      positionStrategy,
    });

    this._overlayRef = overlayRef;

    this._viewportChangesSubscription = this._viewportResizer
      .change()
      .subscribe(() => {
        const newOffset = this._viewportResizer.getOffset().left;
        // The width needs to be updated before the positionstrategy is updated
        // because the positionstrategy determines the left offset based on the value
        // of width - if width is 100%, 100vw or max-width is 100% or 100vw
        // the left offset is always set to 0
        this._overlayRef?.updateSize({ width: getOverlayWidth(newOffset) });
        this._overlayRef?.updatePositionStrategy(
          // We need to create a new position strategy instance here otherwise the updatePositionStrategy
          // performs an early access and noop
          this._overlay
            .position()
            .global()
            .left(`${newOffset}px`)
            .bottom('0px'),
        );
      });

    dtSetUiTestAttribute(
      overlayRef.overlayElement,
      overlayRef.overlayElement.id,
      this._elementRef,
      this._config,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const containerPortal = new TemplatePortal<any>(
      this._templateRef,
      this._viewContainerRef,
    );
    overlayRef.attach(containerPortal);
    if (overlayRef.backdropElement) {
      // make the backdrop invisible and unclickable initially.
      overlayRef.backdropElement.style.pointerEvents = 'none';
      overlayRef.backdropElement.style.backgroundColor = '#ffffff';
      overlayRef.backdropElement.style.opacity = '0';
    }
    this._overlayRef = overlayRef;
  }
}

function getOverlayWidth(offsetLeft: number): string {
  return offsetLeft > 0 ? `calc(100vw - ${offsetLeft}px)` : '100vw';
}
