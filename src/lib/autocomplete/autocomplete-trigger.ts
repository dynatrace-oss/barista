import {
  Provider,
  forwardRef,
  Directive,
  Input,
  ElementRef,
  Renderer2,
  OnDestroy,
  ChangeDetectorRef,
  Host,
  Optional,
  NgZone,
  Inject,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  OverlayRef,
  Overlay,
  FlexibleConnectedPositionStrategy,
  PositionStrategy,
  OverlayConfig,
} from '@angular/cdk/overlay';
import { DtFormField } from '@dynatrace/angular-components/form-field';
import { DtAutocomplete } from './autocomplete';
import { getDtAutocompleteMissingPanelError } from './autocomplete-errors';
import { DtAutocompleteOrigin } from './autocomplete-origin';
import {
  ESCAPE,
  UP_ARROW,
  ENTER,
  DOWN_ARROW,
  TAB,
} from '@angular/cdk/keycodes';
import {
  Subject,
  EMPTY,
  Subscription,
  merge,
  Observable,
  of as observableOf,
  defer,
  fromEvent,
} from 'rxjs';
import {
  DtViewportResizer,
  DtOptionSelectionChange,
  isDefined,
  DtOption,
  _countGroupLabelsBeforeOption,
  _getOptionScrollPosition,
  readKeyCode,
} from '@dynatrace/angular-components/core';
import {
  tap,
  take,
  delay,
  switchMap,
  filter,
  map,
  takeUntil,
  startWith,
} from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

/** Provider that allows the autocomplete to register as a ControlValueAccessor. */
export const DT_AUTOCOMPLETE_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare no-forward-ref
  useExisting: forwardRef(() => DtAutocompleteTrigger),
  multi: true,
};

/** The height of the select items. */
export const AUTOCOMPLETE_OPTION_HEIGHT = 32;

/** The max height of the select's overlay panel */
export const AUTOCOMPLETE_PANEL_MAX_HEIGHT = 256;

@Directive({
  selector: `input[dtAutocomplete], textarea[dtAutocomplete]`,
  exportAs: 'dtAutocompleteTrigger',
  host: {
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
  implements ControlValueAccessor, OnDestroy {
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
        filter(() => this._overlayAttached)
      ),
      this._closeKeyEventStream,
      this._getOutsideClickStream(),
      this._overlayRef
        ? this._overlayRef
            .detachments()
            .pipe(filter(() => this._overlayAttached))
        : observableOf()
    ).pipe(
      map(event => (event instanceof DtOptionSelectionChange ? event : null))
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
      const options = this.autocomplete ? this.autocomplete.options : null;

      if (options) {
        return options.changes.pipe(
          startWith(options),
          switchMap(() =>
            merge<DtOptionSelectionChange<T>>(
              ...options.map(option => option.selectionChange)
            )
          )
        );
      }

      // If there are any subscribers before `ngAfterViewInit`, the `autocomplete` will be undefined.
      // Return a stream that we'll replace with the real one once everything is in place.
      return this._zone.onStable.asObservable().pipe(
        take(1),
        switchMap(() => this.optionSelections)
      );
    }
  );

  /**
   * Whether the autocomplete can open the next time it is focused. Used to prevent a focused,
   * closed autocomplete from being reopened if the user switches to another browser tab and then
   * comes back.
   */
  private _canOpenOnNextFocus = true;

  /** Strategy that is used to position the panel. */
  private _positionStrategy: FlexibleConnectedPositionStrategy;

  /** Stream of keyboard events that can close the panel. */
  private readonly _closeKeyEventStream = new Subject<void>();

  /** Subscription to viewport size changes. */
  private _viewportSubscription = EMPTY.subscribe();

  /** The subscription for closing actions (some are bound to document). */
  private _closingActionsSubscription = EMPTY.subscribe();

  /** Old value of the native input. Used to work around issues with the `input` event on IE. */
  private _previousValue: string | number | null;

  private _disposableFns: Array<() => void> = [];

  constructor(
    private _element: ElementRef<HTMLInputElement>,
    private _renderer: Renderer2,
    private _overlay: Overlay,
    private _changeDetectorRef: ChangeDetectorRef,
    private _viewportResizer: DtViewportResizer,
    private _zone: NgZone,
    @Optional() @Host() private _formField: DtFormField<string>,
    // tslint:disable-next-line:no-any
    @Optional() @Inject(DOCUMENT) private _document: any
  ) {
    // tslint:disable-next-line:strict-type-predicates
    if (typeof window !== 'undefined') {
      _zone.runOutsideAngular(() => {
        this._disposableFns.push(
          this._renderer.listen(window, 'blur', () => {
            // If the user blurred the window while the autocomplete is focused, it means that it'll be
            // refocused when they come back. In this case we want to skip the first focus event, if the
            // pane was closed, in order to avoid reopening it unintentionally.
            this._canOpenOnNextFocus =
              document.activeElement !== this._element.nativeElement ||
              this.panelOpen;
          })
        );
      });
    }
  }

  ngOnDestroy(): void {
    this._disposableFns.forEach(fn => {
      fn();
    });
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

  _handleFocus(): void {
    if (!this._canOpenOnNextFocus) {
      this._canOpenOnNextFocus = true;
    } else if (this._canOpen()) {
      this._previousValue = this._element.nativeElement.value;
      this.openPanel();
    }
  }

  _handleBlur(): void {
    if (this.panelOpen) {
      this.autocomplete.closed
        .pipe(
          take(1),
          takeUntil(this.autocomplete.opened.asObservable())
        )
        .subscribe(() => {
          this._onTouched();
        });
    } else {
      this._onTouched();
    }
  }

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

  _handleKeydown(event: KeyboardEvent): void {
    const keyCode = readKeyCode(event);

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

      this._overlayRef.keydownEvents().subscribe(event => {
        const keyCode = readKeyCode(event);
        // Close when pressing ESCAPE or ALT + UP_ARROW, based on the a11y guidelines.
        // See: https://www.w3.org/TR/wai-aria-practices-1.1/#textbox-keyboard-interaction
        if (keyCode === ESCAPE || (keyCode === UP_ARROW && event.altKey)) {
          this._resetActiveItem();
          this._closeKeyEventStream.next();
        }
      });

      if (this._viewportResizer) {
        this._viewportSubscription = this._viewportResizer
          .change()
          .subscribe(() => {
            if (this.panelOpen && this._overlayRef) {
              this._overlayRef.updateSize({ width: this._getPanelWidth() });
            }
          });
      }
    } else {
      // Update the panel width and position in case anything has changed.
      this._overlayRef.updateSize({ width: this._getPanelWidth() });
      this._overlayRef.updatePosition();
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
      positionStrategy: this._getOverlayPosition(),
      scrollStrategy: this._overlay.scrollStrategies.block(),
      width: this._getPanelWidth(),
    });
  }

  private _getOverlayPosition(): PositionStrategy {
    this._positionStrategy = this._overlay
      .position()
      .flexibleConnectedTo(this._getConnectedElement())
      .withFlexibleDimensions(false)
      .withPush(false)
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

  /** Resets the active item to -1 so arrow events will activate the orrect options, or to 0 if the consumer opted into it. */
  private _resetActiveItem(): void {
    this.autocomplete._keyManager.setActiveItem(
      this.autocomplete.autoActiveFirstOption ? 0 : -1
    );
  }

  /**
   * This method listens to a stream of panel closing actions and resets the
   * stream every time the option list changes.
   */
  private _subscribeToClosingActions(): Subscription {
    const firstStable = this._zone.onStable.asObservable().pipe(take(1));
    const optionChanges = this.autocomplete.options.changes.pipe(
      tap(() => {
        this._positionStrategy.reapplyLastPosition();
      }),
      // Defer emitting to the stream until the next tick, because changing
      // bindings in here will cause "changed after checked" errors.
      delay(0)
    );

    // When the zone is stable initially, and when the option list changes...
    return (
      merge(firstStable, optionChanges)
        .pipe(
          // create a new stream of panelClosingActions, replacing any previous streams
          // that were created, and flatten it so our stream only emits closing events...
          switchMap(optionChange => {
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
          take(1)
        )
        // set the value, close the panel, and complete.
        .subscribe(event => {
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
      fromEvent<TouchEvent>(this._document, 'touchend')
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
          (!!this._overlayRef &&
            !this._overlayRef.overlayElement.contains(clickTarget))
        );
      })
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
    this.autocomplete.options.forEach(option => {
      if (option !== skip && option.selected) {
        option.deselect();
      }
    });
  }

  private _setTriggerValue(value: T): void {
    let stringifiedValue = '';
    if (isDefined(value)) {
      // tslint:disable-next-line:no-any
      stringifiedValue =
        value && value.toString ? value.toString() : (value as any);
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
      this.autocomplete.options,
      this.autocomplete.optionGroups
    );

    const newScrollPosition = _getOptionScrollPosition(
      index + labelCount,
      AUTOCOMPLETE_OPTION_HEIGHT,
      this.autocomplete._getScrollTop(),
      AUTOCOMPLETE_PANEL_MAX_HEIGHT
    );

    this.autocomplete._setScrollTop(newScrollPosition);
  }

  // Implemented as part of ControlValueAccessor.
  writeValue(value: T): void {
    Promise.resolve(null).then(() => {
      this._setTriggerValue(value);
    });
  }

  // Implemented as part of ControlValueAccessor.
  // tslint:disable-next-line:no-any
  registerOnChange(fn: (value: any) => {}): void {
    this._onChange = fn;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled: boolean): void {
    this._element.nativeElement.disabled = isDisabled;
  }
}
