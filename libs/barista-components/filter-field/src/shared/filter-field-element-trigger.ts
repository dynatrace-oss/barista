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

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, UP_ARROW } from '@angular/cdk/keycodes';
import {
  Overlay,
  OverlayConfig,
  OverlayContainer,
  OverlayRef,
  PositionStrategy,
  ViewportRuler,
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Optional,
} from '@angular/core';
import {
  Constructor,
  DtFlexibleConnectedPositionStrategy,
  DtUiTestConfiguration,
  DtViewportResizer,
  DT_UI_TEST_CONFIG,
  mixinViewportBoundaries,
  _countGroupLabelsBeforeOption,
  _getOptionScrollPosition,
  _readKeyCode,
} from '@dynatrace/barista-components/core';
import {
  EMPTY,
  fromEvent,
  merge,
  Observable,
  of as observableOf,
  Subject,
  Subscription,
} from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { DtFilterFieldElement } from './filter-field-element';

// Boilerplate for applying mixins to DtFilterFieldElementTrigger.
export class DtFilterFieldElementTriggerBase {
  constructor(public _viewportResizer: DtViewportResizer) {}
}
export const _DtFilterFieldElementTriggerMixinBase = mixinViewportBoundaries<
  Constructor<DtFilterFieldElementTriggerBase>
>(DtFilterFieldElementTriggerBase);

@Directive({
  host: {
    class: 'dt-element-trigger',
    '[attr.aria-expanded]': 'elementDisabled ? null : panelOpen.toString()',
    '[attr.aria-owns]': '(elementDisabled || !panelOpen) ? null : element?.id',
    '(focusin)': '_handleFocus()',
    '(blur)': '_handleBlur()',
    '(input)': '_handleInput($event)',
    '(keydown)': '_handleKeydown($event)',
  },
})
export class DtFilterFieldElementTrigger<
    T extends DtFilterFieldElement<unknown>,
  >
  extends _DtFilterFieldElementTriggerMixinBase
  implements OnDestroy
{
  protected _optionHeight: number;
  protected _maxPanelHeight: number;

  protected _overlayRef: OverlayRef | null;
  protected _componentDestroyed = false;

  /**
   * The filter-field element panel to be attached to this trigger.
   * This should be overwritten by the specific trigger
   */
  @Input('dtFilterFieldElement')
  get element(): T {
    return this._element;
  }
  set element(value: T) {
    this._element = value;
    this._detachOverlay();
  }
  protected _element: T;

  /**
   * Whether the autocomplete is disabled. When disabled, the element will
   * act as a regular input and the user won't be able to open the panel.
   * This should be overwritten by the specific trigger
   */
  @Input('dtFilterFieldElementDisabled')
  get elementDisabled(): boolean {
    return this._elementDisabled;
  }
  set elementDisabled(value: boolean) {
    this._elementDisabled = coerceBooleanProperty(value);
  }
  protected _elementDisabled = false;

  /** `View -> model callback called when value changes` */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected _onChange: (value: any) => void = () => {};

  /** `View -> model callback called when autocomplete has been touched` */
  protected _onTouched = () => {};

  /** Whether or not the filter-field element panel is open. */
  get panelOpen(): boolean {
    return (
      !!(this._overlayRef && this._overlayRef.hasAttached()) &&
      this._element._isOpen
    );
  }

  /**
   * A stream of actions that should close the autocomplete panel, including
   * when an option is selected, on blur, and when TAB is pressed.
   */
  get panelClosingActions(): Observable<null> {
    return merge(
      // this.element._keyManager.tabOut.pipe(
      //   filter(() => this._overlayAttached),
      // ),
      this._closeKeyEventStream,
      this._getOutsideClickStream(),
      this._overlayRef
        ? this._overlayRef
            .detachments()
            .pipe(
              filter(
                () => !!(this._overlayRef && this._overlayRef.hasAttached()),
              ),
            )
        : observableOf(),
    ).pipe(map(() => null));
  }

  /**
   * Whether the autocomplete can open the next time it is focused. Used to prevent a focused,
   * closed autocomplete from being reopened if the user switches to another browser tab and then
   * comes back.
   */
  protected _canOpenOnNextFocus = true;

  /**
   * Strategy that is used to position the panel.
   */
  protected _positionStrategy: DtFlexibleConnectedPositionStrategy;

  /** Stream of keyboard events that can close the panel. */
  protected readonly _closeKeyEventStream = new Subject<void>();

  /** The subscription for closing actions (some are bound to document). */
  protected _closingActionsSubscription = EMPTY.subscribe();

  /** Old value of the native input. Used to work around issues with the `input` event on IE. */
  protected _previousValue: string | number | null;

  _destroy$ = new Subject<void>();

  /** The current viewport boundaries */
  private _viewportBoundaries = { left: 0, top: 0 };

  // TODO: clean-up unneeded dependencies
  constructor(
    protected _elementRef: ElementRef,
    protected _overlay: Overlay,
    protected _changeDetectorRef: ChangeDetectorRef,
    public _viewportResizer: DtViewportResizer,
    protected _zone: NgZone,
    protected _viewportRuler: ViewportRuler,
    protected _platform: Platform,
    protected _overlayContainer: OverlayContainer,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Optional() @Inject(DOCUMENT) protected _document?: any,
    @Optional()
    @Inject(DT_UI_TEST_CONFIG)
    protected _config?: DtUiTestConfiguration,
  ) {
    super(_viewportResizer);
    // eslint-disable-next-line
    if (typeof window !== 'undefined') {
      _zone.runOutsideAngular(() => {
        fromEvent(window, 'blur')
          .pipe(takeUntil(this._destroy$))
          .subscribe(() => {
            // If the user blurred the window while the autocomplete is focused, it means that it'll be
            // refocused when they come back. In this case we want to skip the first focus event, if the
            // pane was closed, in order to avoid reopening it unintentionally.
            this._canOpenOnNextFocus =
              document.activeElement !== this._elementRef.nativeElement ||
              this.panelOpen;
          });
      });
    }
    this._viewportBoundaries$.subscribe((boundaries) => {
      this._viewportBoundaries = boundaries;
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._closingActionsSubscription.unsubscribe();
    this._componentDestroyed = true;
    this._destroyPanel();
    this._closeKeyEventStream.complete();
  }

  /** Opens the filter-field element panel. */
  openPanel(): void {
    if (this._element) {
      this._attachOverlay();
    }
  }

  /** Closes the filter-field element panel. */
  closePanel(shouldEmit: boolean = true): void {
    if (this._overlayRef && !this._overlayRef.hasAttached()) {
      return;
    }

    if (this.panelOpen && shouldEmit) {
      // Only emit if the panel was visible.
      this.element.closed.emit();
    }

    // Note that in some cases this can end up being called after the component is destroyed.
    // Add a check to ensure that we don't try to run change detection on a destroyed view.
    if (!this._componentDestroyed) {
      this.element._isOpen = false;
      this._detachOverlay();
      // We need to trigger change detection manually, because
      // `fromEvent` doesn't seem to do it at the proper time.
      // This ensures that the label is reset when the
      // user clicks outside.
      this._changeDetectorRef.detectChanges();
    }
  }

  /** @internal Handles the focussing of the filter-field-element. */
  _handleFocus(): void {
    if (!this._canOpenOnNextFocus) {
      this._canOpenOnNextFocus = true;
    } else if (this._canOpen()) {
      this.openPanel();
    }
  }

  /** @internal Handler when the trigger loses focus. */
  _handleBlur(): void {
    if (this.panelOpen) {
      this.element.closed
        .pipe(take(1), takeUntil(this.element.opened.asObservable()))
        .subscribe(() => {
          this._onTouched();
        });
    } else {
      this._onTouched();
    }
  }

  /** @internal Handler when the user is typing. */
  _handleInput(event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;
    let value: number | string | null = target.value;

    // Based on `NumberValueAccessor` from forms.
    if (target.type === 'number') {
      value = value === '' ? null : parseFloat(value);
    }

    // If the input has a placeholder, IE will fire the `input` event on page load,
    // focus and blur, in addition to when the user actually changed the value. To
    // filter out all of the extra events, we save the value on focus and between
    // `input` events, and we check whether it changed.
    // See: https://connect.microsoft.com/IE/feedback/details/885747/
    if (
      this._previousValue !== value &&
      document.activeElement === event.target
    ) {
      this._previousValue = value;
      this._onChange(value);

      if (this._canOpen()) {
        this.openPanel();
      }
    }
  }

  /** @internal Handler for the users key down events. */
  /* eslint-disable no-unused-expressions,@typescript-eslint/no-unused-expressions */
  _handleKeydown(event: KeyboardEvent): void {
    void event;
  }
  /* eslint-enable no-unused-expressions, @typescript-eslint/no-unused-expressions */

  /** Determines whether the panel can be opened. */
  protected _canOpen(): boolean {
    const element = this._elementRef.nativeElement;
    return !element.readOnly && !element.disabled && !this._elementDisabled;
  }

  /** Attach the filter-field-element overlay. */
  protected _attachOverlay(): void {
    if (!this._overlayRef) {
      this._overlayRef = this._overlay.create(this._getOverlayConfig());
      this._overlayRef.keydownEvents().subscribe((event) => {
        const keyCode = _readKeyCode(event);
        // Close when pressing ESCAPE or ALT + UP_ARROW, based on the a11y guidelines.
        // See: https://www.w3.org/TR/wai-aria-practices-1.1/#textbox-keyboard-interaction
        if (keyCode === ESCAPE || (keyCode === UP_ARROW && event.altKey)) {
          // this._resetActiveItem();
          this._closeKeyEventStream.next();
        }
      });
    }

    if (this._overlayRef && !this._overlayRef.hasAttached()) {
      this._overlayRef.attach(this._element._portal);
      // Always unsubscribe here, it might happen that no
      // closing action was triggered in between 2 calls
      // to this method
      this._closingActionsSubscription.unsubscribe();
      this._closingActionsSubscription = this._subscribeToClosingActions();
    }

    this.element._isOpen = this._overlayRef.hasAttached();
    this.element.opened.emit();

    if (this.panelOpen) {
      this._overlayRef.updatePositionStrategy(this._getOverlayPosition());
    }

    this.element._markForCheck();
    this._changeDetectorRef.detectChanges();
  }

  /** Detach the filter-field-element overlay */
  protected _detachOverlay(): void {
    if (this._overlayRef) {
      this._overlayRef.detach();
    }
  }

  /** Destroys the filter-field element suggestion panel. */
  protected _destroyPanel(): void {
    if (this._overlayRef) {
      this.closePanel();
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  /** Returns the width of the input element, so the panel width can match it. */
  protected _getHostWidth(): number {
    return this._getConnectedElement().nativeElement.getBoundingClientRect()
      .width;
  }

  protected _getConnectedElement(): ElementRef {
    return this._elementRef;
  }

  /** Returns the overlay configuration for the filter-field-element. */
  protected _getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this._getOverlayPosition(),
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
    });
  }

  /** Returns the overlay position. */
  protected _getOverlayPosition(): PositionStrategy {
    return new DtFlexibleConnectedPositionStrategy(
      this._elementRef,
      this._viewportRuler,
      this._document,
      this._platform,
      this._overlayContainer,
    )
      .withFlexibleDimensions(false)
      .withPush(false)
      .withViewportBoundaries(this._viewportBoundaries)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          panelClass: 'dt-autocomplete-panel-above',
        },
      ]);
  }

  /** Resets the active item to -1 so arrow events will activate the correct options, or to 0 if the consumer opted into it. */
  protected _resetActiveItem(): void {}

  /**
   * This method listens to a stream of panel closing actions and resets the
   * stream every time the option list changes.
   */
  protected _subscribeToClosingActions(): Subscription {
    return (
      this.panelClosingActions
        .pipe(take(1))
        // set the value, close the panel, and complete.
        .subscribe(() => {
          // this._setValueAndClose(event);
          this.closePanel();
        })
    );
  }

  /** Stream of clicks outside of the autocomplete panel. */
  protected _getOutsideClickStream(): Observable<Event | null> {
    if (!this._document) {
      return observableOf(null);
    }

    return merge(
      fromEvent<MouseEvent>(this._document, 'click'),
      fromEvent<TouchEvent>(this._document, 'touchend'),
    ).pipe(
      filter((event: Event) => {
        const clickTarget = event.target as HTMLElement;

        return (
          !!(this._overlayRef && this._overlayRef.hasAttached()) &&
          clickTarget !== this._elementRef.nativeElement &&
          !!this._overlayRef &&
          !this._overlayRef.overlayElement.contains(clickTarget)
        );
      }),
    );
  }
}
