import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
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
} from '@angular/core';
import { Subscription } from 'rxjs';

import { DtLogger, DtLoggerFactory } from '@dynatrace/angular-components/core';

import {
  DT_CONFIRMATION_BACKDROP_ACTIVE_OPACITY,
  DT_CONFIRMATION_POP_DURATION,
} from './confirmation-dialog-constants';
import { DtConfirmationDialogState } from './confirmation-dialog-state/confirmation-dialog-state';

const LOG: DtLogger = DtLoggerFactory.create('DtConfirmationDialog');

@Component({
  moduleId: module.id,
  templateUrl: './confirmation-dialog.html',
  styleUrls: ['./confirmation-dialog.scss'],
  selector: 'dt-confirmation-dialog',
  exportAs: 'dtConfirmationDialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  host: {
    class: 'dt-confirmation-dialog',
    '[attr.aria-label]': 'ariaLabel',
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
          transform: `translateY(100%)`,
        }),
      ),
      transition('up => down', [
        animate(`${DT_CONFIRMATION_POP_DURATION}ms ease`),
      ]),
      transition('down => up', [
        animate(`${DT_CONFIRMATION_POP_DURATION}ms ease`),
      ]),
    ]),
  ],
})
export class DtConfirmationDialog
  implements AfterContentChecked, AfterContentInit, OnDestroy {
  /** Input for the aria-label on the confirmation dialog */
  @Input('aria-label') ariaLabel: string;

  /** Show a backdrop covering all page functionality except the confirmation dialog. */
  @Input()
  get showBackdrop(): boolean {
    return this._showBackdrop;
  }
  set showBackdrop(value: boolean) {
    this._showBackdrop = coerceBooleanProperty(value);
    this._updateBackdropVisibility();
  }

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
  private readonly _templateRef: TemplateRef<{}>;
  /** All the "state" child elements. */
  @ContentChildren(DtConfirmationDialogState)
  private readonly _stateChildren: QueryList<DtConfirmationDialogState>;
  /** A static reference to the currently active dialog to prevent multiple */
  private static _activeDialog: DtConfirmationDialog | null = null;
  private _overlayRef: OverlayRef;
  private _showBackdrop = false;
  private _stateChildrenSubscription: Subscription = Subscription.EMPTY;

  /** @internal holds the current position state for the animation */
  _positionState: 'down' | 'up' = 'down';

  constructor(
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngAfterContentChecked(): void {
    if (this._selectedState !== this._stateToSelect) {
      this._update();
      this._selectedState = this._stateToSelect;
    }
  }

  ngAfterContentInit(): void {
    this._createAndAttachOverlay();
    this._updateBackdropVisibility();
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
    this._overlayRef.dispose();
    this._stateChildrenSubscription.unsubscribe();
  }

  /** Updates the children's active properties and the position of the dialog depending on the state to select */
  private _update(): void {
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
      this._stateChildren.forEach(child => {
        child._updateActive(this._stateToSelect === child.name);
      });
      this._positionState = this._stateChildren.some(child => child._isActive)
        ? 'up'
        : 'down';
    });
    this._changeDetectorRef.markForCheck();
  }

  /**
   * @internal
   * Update the visibilty (opacity, pointer-events) of the backdrop
   */
  private _updateBackdropVisibility(): void {
    if (this._overlayRef && this._overlayRef.backdropElement) {
      if (this._showBackdrop) {
        this._overlayRef.backdropElement.style.opacity = DT_CONFIRMATION_BACKDROP_ACTIVE_OPACITY;
        this._overlayRef.backdropElement.style.pointerEvents = 'auto';
      } else {
        this._overlayRef.backdropElement.style.opacity = '0';
        this._overlayRef.backdropElement.style.pointerEvents = 'none';
      }
    }
  }

  /** Creates and attaches the overlay to the dom */
  private _createAndAttachOverlay(): void {
    const positionStrategy = this._overlay
      .position()
      .global()
      .centerHorizontally()
      .bottom(`0px`);

    const overlayRef = this._overlay.create({
      ...{
        hasBackdrop: true,
        backdropClass: 'confirmation-dialog-backdrop',
        width: '100%',
        panelClass: 'dt-confirmation-dialog-content',
      },
      positionStrategy,
    });
    const containerPortal = new TemplatePortal<{}>(
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
