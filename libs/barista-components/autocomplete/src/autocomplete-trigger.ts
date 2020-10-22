/**
 * @license
 * Copyright 2020 Dynatrace LLC
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
import {
  DOWN_ARROW,
  ENTER,
  ESCAPE,
  TAB,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import {
  Overlay,
  OverlayConfig,
  OverlayContainer,
  OverlayRef,
  PositionStrategy,
  ViewportRuler,
} from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  forwardRef,
  Host,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  Provider,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  defer,
  EMPTY,
  fromEvent,
  merge,
  Observable,
  of as observableOf,
  Subject,
  Subscription,
} from 'rxjs';
import {
  delay,
  filter,
  map,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';

import {
  _countGroupLabelsBeforeOption,
  _getOptionScrollPosition,
  _readKeyCode,
  DT_UI_TEST_CONFIG,
  DtFlexibleConnectedPositionStrategy,
  DtOption,
  DtOptionSelectionChange,
  dtSetUiTestAttribute,
  DtUiTestConfiguration,
  DtViewportResizer,
  isDefined,
  stringify,
  ViewportBoundaries,
  mixinViewportBoundaries,
  Constructor,
} from '@dynatrace/barista-components/core';
import { DtFormField } from '@dynatrace/barista-components/form-field';

import { DtAutocomplete } from './autocomplete';
import { getDtAutocompleteMissingPanelError } from './autocomplete-errors';
import { DtAutocompleteOrigin } from './autocomplete-origin';
import { Platform } from '@angular/cdk/platform';

/** Provider that allows the autocomplete to register as a ControlValueAccessor. */
export const DT_AUTOCOMPLETE_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare no-forward-ref
  useExisting: forwardRef(() => DtAutocompleteTrigger),
  multi: true,
};

/** Interface for InjectionToken to configure properties of DtOptions. */
export interface DtOptionConfiguration {
  height: number;
}

/** InjectionToken of the DtOption configuration. */
export const DT_OPTION_CONFIG = new InjectionToken<DtOptionConfiguration>(
  'DT_OPTION_CONFIGURATION',
);

/** The default height of the select items. */
export const AUTOCOMPLETE_OPTION_HEIGHT = 28;

/** The default max height of the overlay panel containing the options */
export const AUTOCOMPLETE_PANEL_MAX_HEIGHT = 256;

/**
 * Calculates the actual height of an option and the maximum panel height
 * based on a given preferred option height.
 *
 * @param preferredOptionHeight The intended option height
 */
export function calculateOptionHeight(
  preferredOptionHeight: number,
): { height: number; maxPanelHeight: number } {
  const height =
    preferredOptionHeight > AUTOCOMPLETE_OPTION_HEIGHT
      ? preferredOptionHeight
      : AUTOCOMPLETE_OPTION_HEIGHT;

  return {
    height,
    maxPanelHeight:
      AUTOCOMPLETE_PANEL_MAX_HEIGHT % height === 0 ||
      height > AUTOCOMPLETE_PANEL_MAX_HEIGHT
        ? height * 2 - height / 2
        : AUTOCOMPLETE_PANEL_MAX_HEIGHT,
  };
}

// Boilerplate for applying mixins to DtAutocompleteTrigger.
export class DtAutocompleteTriggerBase {
  constructor(public _viewportResizer: DtViewportResizer) {}
}
export const _DtAutocompleteTriggerMixinBase = mixinViewportBoundaries<
  Constructor<DtAutocompleteTriggerBase>
>(DtAutocompleteTriggerBase);

@Directive({
  selector: `input[dtAutocomplete], textarea[dtAutocomplete]`,
  exportAs: 'dtAutocompleteTrigger',
  host: {
    class: 'dt-autocomplete-trigger',
    '[attr.autocomplete]': 'autocompleteAttribute',
    '[attr.role]': 'autocompleteDisabled ? null : "combobox"',
    '[attr.aria-autocomplete]': 'autocompleteDisabled ? null : "list"',
    '[attr.aria-activedescendant]': 'activeOption?.id',
    '[attr.aria-expanded]':
      'autocompleteDisabled ? null : panelOpen.toString()',
    '[attr.aria-owns]':
      '(autocompleteDisabled || !panelOpen) ? null : autocomplete?.id',
    '(focusin)': '_handleFocus()',
    '(blur)': '_handleBlur()',
    '(input)': '_handleInput($event)',
    '(keydown)': '_handleKeydown($event)',
  },
  providers: [DT_AUTOCOMPLETE_VALUE_ACCESSOR],
})
export class DtAutocompleteTrigger<T>
  extends _DtAutocompleteTriggerMixinBase
  implements ControlValueAccessor, OnDestroy {
  private _optionHeight: number;
  private _maxPanelHeight: number;

  private _autocomplete: DtAutocomplete<T>;
  private _autocompleteDisabled = false;
  private _overlayRef: OverlayRef | null;
  private _componentDestroyed = false;
  private _overlayAttached = false;

  /** The autocomplete panel to be attached to this trigger. */
  @Input('dtAutocomplete')
  get autocomplete(): DtAutocomplete<T> {
    return this._autocomplete;
  }
  set autocomplete(value: DtAutocomplete<T>) {
    this._autocomplete = value;
    this._detachOverlay();
  }

  /** autocomplete` attribute to be set on the input element. */
  @Input('autocomplete') autocompleteAttribute = 'off';

  /**
   * Whether the autocomplete is disabled. When disabled, the element will
   * act as a regular input and the user won't be able to open the panel.
   */
  @Input('dtAutocompleteDisabled')
  get autocompleteDisabled(): boolean {
    return this._autocompleteDisabled;
  }
  set autocompleteDisabled(value: boolean) {
    this._autocompleteDisabled = coerceBooleanProperty(value);
  }

  /**
   * Reference relative to which to position the autocomplete panel.
   * Defaults to the autocomplete trigger element.
   */
  @Input('dtAutocompleteConnectedTo') connectedTo: DtAutocompleteOrigin;

  /** `View -> model callback called when value changes` */
  // tslint:disable-next-line:no-any
  private _onChange: (value: any) => void = () => {};

  /** `View -> model callback called when autocomplete has been touched` */
  private _onTouched = () => {};

  /** Whether or not the autocomplete panel is open. */
  get panelOpen(): boolean {
    return this._overlayAttached && this.autocomplete.showPanel;
  }

  /**
   * A stream of actions that should close the autocomplete panel, including
   * when an option is selected, on blur, and when TAB is pressed.
   */
  get panelClosingActions(): Observable<DtOptionSelectionChange<T> | null> {
    return merge(
      this.optionSelections,
      this.autocomplete._keyManager.tabOut.pipe(
        filter(() => this._overlayAttached),
      ),
      this._closeKeyEventStream,
      this._getOutsideClickStream(),
      this._overlayRef
        ? this._overlayRef
            .detachments()
            .pipe(filter(() => this._overlayAttached))
        : observableOf(),
    ).pipe(
      map((event) => (event instanceof DtOptionSelectionChange ? event : null)),
    );
  }

  /** The currently active option, coerced to DtOption type. */
  get activeOption(): DtOption<T> | null {
    if (this.autocomplete && this.autocomplete._keyManager) {
      return this.autocomplete._keyManager.activeItem;
    }
    return null;
  }

  /** Stream of changes to the selection state of the autocomplete options. */
  readonly optionSelections: Observable<DtOptionSelectionChange<T>> = defer(
    () => {
      const optionsChanged = this.autocomplete
        ? this.autocomplete._options
        : null;

      if (optionsChanged) {
        return optionsChanged.changes.pipe(
          startWith(optionsChanged),
          switchMap(() => {
            return merge<DtOptionSelectionChange<T>>(
              ...optionsChanged.map((option) => option.selectionChange),
            );
          }),
        );
      }

      // If there are any subscribers before `ngAfterViewInit`, the `autocomplete` will be undefined.
      // Return a stream that we'll replace with the real one once everything is in place.
      return this._zone.onStable.asObservable().pipe(
        take(1),
        switchMap(() => this.optionSelections),
      );
    },
  );

  /**
   * Whether the autocomplete can open the next time it is focused. Used to prevent a focused,
   * closed autocomplete from being reopened if the user switches to another browser tab and then
   * comes back.
   */
  private _canOpenOnNextFocus = true;

  /**
   * Strategy that is used to position the panel.
   */
  private _positionStrategy: DtFlexibleConnectedPositionStrategy;

  /** Stream of keyboard events that can close the panel. */
  private readonly _closeKeyEventStream = new Subject<void>();

  /** Subscription to viewport size changes. */
  private _viewportSubscription = EMPTY.subscribe();

  /** The subscription for closing actions (some are bound to document). */
  private _closingActionsSubscription = EMPTY.subscribe();

  /** Old value of the native input. Used to work around issues with the `input` event on IE. */
  private _previousValue: string | number | null;

  /** The stream that holds the viewport boundaries in order to be able to limit where an overlay can be positioned */
  private _viewportBoundaries: ViewportBoundaries = { left: 0, top: 0 };

  constructor(
    private _element: ElementRef<HTMLInputElement>,
    private _overlay: Overlay,
    private _changeDetectorRef: ChangeDetectorRef,
    public _viewportResizer: DtViewportResizer,
    private _zone: NgZone,
    private _viewportRuler: ViewportRuler,
    private _platform: Platform,
    private _overlayContainer: OverlayContainer,
    @Optional() @Host() private _formField?: DtFormField<string>,
    // tslint:disable-next-line:no-any
    @Optional() @Inject(DOCUMENT) private _document?: any,
    @Optional()
    @Inject(DT_UI_TEST_CONFIG)
    private _config?: DtUiTestConfiguration,
    @Optional()
    @Inject(DT_OPTION_CONFIG)
    optionConfig?: DtOptionConfiguration,
  ) {
    super(_viewportResizer);
    // tslint:disable-next-line:strict-type-predicates
    if (typeof window !== 'undefined') {
      _zone.runOutsideAngular(() => {
        fromEvent(window, 'blur')
          .pipe(takeUntil(this._destroy$))
          .subscribe(() => {
            // If the user blurred the window while the autocomplete is focused, it means that it'll be
            // refocused when they come back. In this case we want to skip the first focus event, if the
            // pane was closed, in order to avoid reopening it unintentionally.
            this._canOpenOnNextFocus =
              document.activeElement !== this._element.nativeElement ||
              this.panelOpen;
          });
      });
    }

    this._viewportResizer
      .change()
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        if (this.panelOpen && this._overlayRef) {
          this._overlayRef.updateSize({ maxWidth: this._getPanelWidth() });
        }
      });

    this._viewportBoundaries$.subscribe((boundaries) => {
      this._viewportBoundaries = boundaries;
      if (this.panelOpen) {
        // attachOverlay updates the position strategy of an already existing
        // overlay
        this._attachOverlay();
      }
    });

    const heightConfig = calculateOptionHeight(optionConfig?.height ?? 0);

    this._optionHeight = heightConfig.height;
    this._maxPanelHeight = heightConfig.maxPanelHeight;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._viewportSubscription.unsubscribe();
    this._componentDestroyed = true;
    this._destroyPanel();
    this._closeKeyEventStream.complete();
  }

  /** Opens the autocomplete suggestion panel. */
  openPanel(): void {
    this._attachOverlay();
  }

  /** Closes the autocomplete suggestion panel. */
  closePanel(): void {
    if (!this._overlayAttached) {
      return;
    }

    if (this.panelOpen) {
      // Only emit if the panel was visible.
      this.autocomplete.closed.emit();
    }

    this.autocomplete._isOpen = false;
    this._detachOverlay();

    // Note that in some cases this can end up being called after the component is destroyed.
    // Add a check to ensure that we don't try to run change detection on a destroyed view.
    if (!this._componentDestroyed) {
      // We need to trigger change detection manually, because
      // `fromEvent` doesn't seem to do it at the proper time.
      // This ensures that the label is reset when the
      // user clicks outside.
      this._changeDetectorRef.detectChanges();
    }
  }

  /** @internal Handler when the trigger receives focus. */
  _handleFocus(): void {
    if (!this._canOpenOnNextFocus) {
      this._canOpenOnNextFocus = true;
    } else if (this._canOpen()) {
      this._previousValue = this._element.nativeElement.value;
      this.openPanel();
    }
  }

  /** @internal Handler when the trigger loses focus. */
  _handleBlur(): void {
    if (this.panelOpen) {
      this.autocomplete.closed
        .pipe(take(1), takeUntil(this.autocomplete.opened.asObservable()))
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
  _handleKeydown(event: KeyboardEvent): void {
    const keyCode = _readKeyCode(event);

    // Prevent the default action on all escape key presses. This is here primarily to bring IE
    // in line with other browsers. By default, pressing escape on IE will cause it to revert
    // the input value to the one that it had on focus, however it won't dispatch any events
    // which means that the model value will be out of sync with the view.
    if (keyCode === ESCAPE) {
      event.preventDefault();
    }

    if (this.activeOption && keyCode === ENTER && this.panelOpen) {
      this.activeOption._selectViaInteraction();
      this._resetActiveItem();
      event.preventDefault();
    } else if (this.autocomplete) {
      const prevActiveItem = this.autocomplete._keyManager.activeItem;
      const isArrowKey = keyCode === UP_ARROW || keyCode === DOWN_ARROW;

      if (this.panelOpen || keyCode === TAB) {
        this.autocomplete._keyManager.onKeydown(event);
      } else if (isArrowKey && this._canOpen()) {
        this.openPanel();
      }

      if (
        isArrowKey ||
        this.autocomplete._keyManager.activeItem !== prevActiveItem
      ) {
        this._scrollToOption();
      }
    }
  }

  private _attachOverlay(): void {
    if (!this.autocomplete) {
      throw getDtAutocompleteMissingPanelError();
    }

    if (!this._overlayRef) {
      this._overlayRef = this._overlay.create(this._getOverlayConfig());
      dtSetUiTestAttribute(
        this._overlayRef.overlayElement,
        this._overlayRef.overlayElement.id,
        this._element,
        this._config,
      );
      this._overlayRef.keydownEvents().subscribe((event) => {
        const keyCode = _readKeyCode(event);
        // Close when pressing ESCAPE or ALT + UP_ARROW, based on the a11y guidelines.
        // See: https://www.w3.org/TR/wai-aria-practices-1.1/#textbox-keyboard-interaction
        if (keyCode === ESCAPE || (keyCode === UP_ARROW && event.altKey)) {
          this._resetActiveItem();
          this._closeKeyEventStream.next();
        }
      });
    } else {
      // Update the panel width and position in case anything has changed.
      this._overlayRef.updateSize({ maxWidth: this._getPanelWidth() });
      this._overlayRef.updatePositionStrategy(
        this._getOverlayPositionStrategy(),
      );
    }

    if (this._overlayRef && !this._overlayRef.hasAttached()) {
      this._overlayRef.attach(this._autocomplete._portal);
      this._closingActionsSubscription = this._subscribeToClosingActions();
    }

    const wasOpen = this.panelOpen;

    this.autocomplete._setVisibility();
    this.autocomplete._isOpen = this._overlayAttached = true;

    // We need to do an extra `panelOpen` check in here, because the
    // autocomplete won't be shown if there are no options.
    if (this.panelOpen && wasOpen !== this.panelOpen) {
      this.autocomplete.opened.emit();
    }
  }

  private _detachOverlay(): void {
    this._overlayAttached = false;
    this._closingActionsSubscription.unsubscribe();
    if (this._overlayRef) {
      this._overlayRef.detach();
    }
  }

  /** Destroys the autocomplete suggestion panel. */
  private _destroyPanel(): void {
    if (this._overlayRef) {
      this.closePanel();
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  private _getPanelWidth(): number | string {
    return this.autocomplete.panelWidth || this._getHostWidth();
  }

  /** Returns the width of the input element, so the panel width can match it. */
  private _getHostWidth(): number {
    return this._getConnectedElement().nativeElement.getBoundingClientRect()
      .width;
  }

  private _getConnectedElement(): ElementRef {
    if (this.connectedTo) {
      return this.connectedTo.elementRef;
    }

    return this._formField
      ? this._formField.getConnectedOverlayOrigin()
      : this._element;
  }

  // TODO: reconsider if this config should be providable
  private _getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this._getOverlayPositionStrategy(),
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
      maxWidth: this._getPanelWidth(),
    });
  }

  private _getOverlayPositionStrategy(): PositionStrategy {
    const originalPositionStrategy = new DtFlexibleConnectedPositionStrategy(
      this._getConnectedElement(),
      this._viewportRuler,
      this._document,
      this._platform,
      this._overlayContainer,
    );

    this._positionStrategy = originalPositionStrategy
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
        // tslint:disable-next-line:no-any
      ] as any[]);

    return this._positionStrategy;
  }

  /** Resets the active item to -1 so arrow events will activate the correct options, or to 0 if the consumer opted into it. */
  private _resetActiveItem(): void {
    this.autocomplete._keyManager.setActiveItem(
      this.autocomplete.autoActiveFirstOption ? 0 : -1,
    );
  }

  /**
   * This method listens to a stream of panel closing actions and resets the
   * stream every time the option list changes.
   */
  private _subscribeToClosingActions(): Subscription {
    const firstStable = this._zone.onStable.asObservable().pipe(take(1));
    const optionChanges = this.autocomplete._options.changes.pipe(
      tap(() => {
        this._positionStrategy.reapplyLastPosition();
      }),
      // Defer emitting to the stream until the next tick, because changing
      // bindings in here will cause "changed after checked" errors.
      delay(0),
    );

    // When the zone is stable initially, and when the option list changes...
    return (
      merge(firstStable, optionChanges)
        .pipe(
          // create a new stream of panelClosingActions, replacing any previous streams
          // that were created, and flatten it so our stream only emits closing events...
          switchMap((optionChange) => {
            this._resetActiveItem();
            this.autocomplete._setVisibility();

            if (this.panelOpen) {
              this._overlayRef!.updatePosition();
            }

            // TODO @thomas.pink: Remove/Rework once angular material issue has been resolved
            // https://github.com/angular/material2/issues/13734
            if (!optionChange) {
              this._changeDetectorRef.detectChanges();
            }
            return this.panelClosingActions;
          }),
          // when the first closing event occurs...
          take(1),
        )
        // set the value, close the panel, and complete.
        .subscribe((event) => {
          this._setValueAndClose(event);
        })
    );
  }

  /** Stream of clicks outside of the autocomplete panel. */
  // tslint:disable-next-line:no-any
  private _getOutsideClickStream(): Observable<any> {
    if (!this._document) {
      return observableOf(null);
    }

    return merge(
      fromEvent<MouseEvent>(this._document, 'click'),
      fromEvent<TouchEvent>(this._document, 'touchend'),
    ).pipe(
      filter((event: Event) => {
        const clickTarget = event.target as HTMLElement;
        const formField = this._formField
          ? this._formField._elementRef.nativeElement
          : null;

        return (
          this._overlayAttached &&
          clickTarget !== this._element.nativeElement &&
          (!formField || !formField.contains(clickTarget)) &&
          !!this._overlayRef &&
          !this._overlayRef.overlayElement.contains(clickTarget)
        );
      }),
    );
  }

  /**
   * This method closes the panel, and if a value is specified, also sets the associated
   * control to that value. It will also mark the control as dirty if this interaction
   * stemmed from the user.
   */
  private _setValueAndClose(event: DtOptionSelectionChange<T> | null): void {
    if (event && event.source) {
      const source = event.source;
      const value = source.value;
      this._clearPreviousSelectedOption(source);
      this._setTriggerValue(value);
      this._onChange(value);
      this._element.nativeElement.focus();
      this.autocomplete._emitSelectEvent(event.source);
    }
    this.closePanel();
  }

  /** Clear any previous selected option and emit a selection change event for this option */
  private _clearPreviousSelectedOption(skip: DtOption<T>): void {
    this.autocomplete._options.forEach((option) => {
      if (option !== skip && option.selected) {
        option.deselect();
      }
    });
  }

  private _setTriggerValue(value: T): void {
    let stringifiedValue = '';
    if (isDefined(value)) {
      stringifiedValue = stringify(value);
    }

    const toDisplay =
      this.autocomplete && this.autocomplete.displayWith
        ? this.autocomplete.displayWith(value)
        : stringifiedValue;

    // Simply falling back to an empty string if the display value is falsy does not work properly.
    // The display value can also be the number zero and shouldn't fall back to an empty string.
    // tslint:disable-next-line:no-any
    const inputValue = isDefined(toDisplay) ? toDisplay : '';

    // If it's used within a `DtFormField`, we should set it through the property so it can go
    // through change detection.
    if (this._formField) {
      this._formField._control.value = inputValue;
    } else {
      this._element.nativeElement.value = inputValue;
    }
  }

  /** Determines whether the panel can be opened. */
  private _canOpen(): boolean {
    const element = this._element.nativeElement;
    return (
      !element.readOnly && !element.disabled && !this._autocompleteDisabled
    );
  }

  private _scrollToOption(): void {
    const index = this.autocomplete._keyManager.activeItemIndex || 0;
    const labelCount = _countGroupLabelsBeforeOption(
      index,
      this.autocomplete._options.toArray(),
    );

    const newScrollPosition = _getOptionScrollPosition(
      index + labelCount,
      this._optionHeight,
      this.autocomplete._getScrollTop(),
      this._maxPanelHeight,
    );

    this.autocomplete._setScrollTop(newScrollPosition);
  }

  /** Implemented as part of ControlValueAccessor. */
  writeValue(value: T): void {
    Promise.resolve(null).then(() => {
      this._setTriggerValue(value);
    });
  }

  /** Implemented as part of ControlValueAccessor. */
  // tslint:disable-next-line:no-any
  registerOnChange(fn: (value: any) => {}): void {
    this._onChange = fn;
  }

  /** Implemented as part of ControlValueAccessor. */
  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  /** Implemented as part of ControlValueAccessor. */
  setDisabledState(isDisabled: boolean): void {
    this._element.nativeElement.disabled = isDisabled;
  }
}
