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

import {
  animate,
  animateChild,
  group,
  query,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ActiveDescendantKeyManager, FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import {
  DOWN_ARROW,
  END,
  ENTER,
  HOME,
  LEFT_ARROW,
  RIGHT_ARROW,
  SPACE,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import {
  AfterContentInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  Self,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  Inject,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm,
} from '@angular/forms';
import { Observable, Subject, defer, merge } from 'rxjs';
import {
  distinctUntilChanged,
  startWith,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';

import {
  CanDisable,
  CanUpdateErrorState,
  DtLogger,
  DtLoggerFactory,
  DtOptgroup,
  DtOption,
  DtOptionSelectionChange,
  ErrorStateMatcher,
  HasTabIndex,
  _countGroupLabelsBeforeOption,
  _getOptionScrollPosition,
  isDefined,
  mixinDisabled,
  mixinErrorState,
  mixinTabIndex,
  _readKeyCode,
  DT_UI_TEST_CONFIG,
  DtUiTestConfiguration,
  dtSetUiTestAttribute,
  DT_COMPARE_WITH_NON_FUNCTION_VALUE_ERROR_MSG,
} from '@dynatrace/barista-components/core';
import {
  DtFormField,
  DtFormFieldControl,
} from '@dynatrace/barista-components/form-field';
import { DtSelectValueTemplate } from './select-value-template';

let uniqueId = 0;

const LOG: DtLogger = DtLoggerFactory.create('DtSelect');

/** The height of the select items. */
export const SELECT_ITEM_HEIGHT = 28;

/** The max height of the select's overlay panel */
export const SELECT_PANEL_MAX_HEIGHT = 256;

/** Change event object that is emitted when the select value has changed. */
export class DtSelectChange<T> {
  constructor(
    /** Reference to the select that emitted the change event. */
    public source: DtSelect<T>,
    /** Current value of the select that emitted the event. */
    public value: T,
  ) {}
}

// Boilerplate for applying mixins to DtSelect.
export class DtSelectBase {
  constructor(
    public _elementRef: ElementRef,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl,
  ) {}
}
export const _DtSelectMixinBase = mixinTabIndex(
  mixinDisabled(mixinErrorState(DtSelectBase)),
);

@Component({
  selector: 'dt-select',
  exportAs: 'dtSelect',
  templateUrl: 'select.html',
  styleUrls: ['select.scss'],
  inputs: ['disabled', 'tabIndex'],
  host: {
    role: 'listbox',
    class: 'dt-select',
    '[class.dt-select-disabled]': 'disabled',
    '[class.dt-select-invalid]': 'errorState',
    '[class.dt-select-required]': 'required',
    '[class.dt-select-open]': 'panelOpen',
    '[attr.id]': 'id',
    '[attr.tabindex]': 'tabIndex',
    '[attr.aria-label]': '_getAriaLabel()',
    '[attr.aria-labelledby]': '_getAriaLabelledby()',
    '[attr.aria-required]': 'required.toString()',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.aria-invalid]': 'errorState',
    '[attr.aria-owns]': 'panelOpen ? _optionIds : null',
    '[attr.aria-describedby]': '_ariaDescribedby || null',
    '[attr.aria-activedescendant]': '_getAriaActiveDescendant()',
    '(keydown)': '_handleKeydown($event)',
    '(focus)': '_onFocus()',
    '(blur)': '_onBlur()',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  animations: [
    trigger('transformPanel', [
      state(
        'void',
        style({
          transform: 'scaleY(0) translateX(-1px)',
          opacity: 0,
        }),
      ),
      state(
        'showing',
        style({
          opacity: 1,
          transform: 'scaleY(1) translateX(-1px)',
        }),
      ),
      transition(
        'void => *',
        group([
          query('@fadeInContent', animateChild()),
          animate('150ms cubic-bezier(0.25, 0.8, 0.25, 1)'),
        ]),
      ),
      transition('* => void', [
        animate('250ms 100ms linear', style({ opacity: 0 })),
      ]),
    ]),
    trigger('fadeInContent', [
      state('showing', style({ opacity: 1 })),
      transition('void => showing', [
        style({ opacity: 0 }),
        animate('150ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
      ]),
    ]),
  ],
  providers: [{ provide: DtFormFieldControl, useExisting: DtSelect }],
})
export class DtSelect<T>
  extends _DtSelectMixinBase
  implements
    OnInit,
    AfterContentInit,
    OnChanges,
    OnDestroy,
    DoCheck,
    ControlValueAccessor,
    CanDisable,
    HasTabIndex,
    DtFormFieldControl<T>,
    CanUpdateErrorState
{
  /** Whether or not the overlay panel is open. */
  private _panelOpen = false;

  /** The scroll position of the overlay panel, calculated to center the selected option. */
  private _scrollTop = 0;

  /** Unique id for this input. */
  private _uid = `dt-select-${uniqueId++}`;

  /** Emits whenever the component is destroyed. */
  private readonly _destroy = new Subject<void>();

  /** @internal The last measured value for the trigger's client bounding rect. */
  _triggerRect: ClientRect;

  /** @internal The aria-describedby attribute on the select for improved a11y. */
  _ariaDescribedby: string;

  /** @internal Deals with the selection logic. */
  _selectionModel: SelectionModel<DtOption<T>>;

  /** @internal Manages keyboard events for options in the panel. */
  _keyManager: ActiveDescendantKeyManager<DtOption<T>>;

  /** @internal `View -> model callback called when value changes` */
  _onChange: (value: T) => void = () => {};

  /** @internal `View -> model callback called when select has been touched` */
  _onTouched = () => {};

  /** @internal The IDs of child options to be passed to the aria-owns attribute. */
  _optionIds = '';

  /**
   * @internal
   * This position config ensures that the top "start" corner of the overlay
   * is aligned with with the top "start" of the origin by default (overlapping
   * the trigger completely). If the panel cannot fit below the trigger, it
   * will fall back to a position above the trigger.
   */
  _positions = [
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
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetX: 2,
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetX: 2,
    },
  ];

  /** @internal Whether the panel's animation is done. */
  _panelDoneAnimating = false;

  /** @internal Emits when the panel element is finished transforming in. */
  _panelDoneAnimatingStream = new Subject<string>();

  /** Whether the select is focused. */
  get focused(): boolean {
    return this._focused || this._panelOpen;
  }
  private _focused = false;

  /** Whether the select has a value. */
  get empty(): boolean {
    return !this._selectionModel || this._selectionModel.isEmpty();
  }

  /** Whether or not the overlay panel is open. */
  get panelOpen(): boolean {
    return this._panelOpen;
  }

  /** The currently selected option. */
  get selected(): DtOption<T> {
    return this._selectionModel.selected[0];
  }

  /** The value displayed in the trigger. */
  get triggerValue(): string {
    return !this.empty ? this._selectionModel.selected[0].viewValue : '';
  }

  /** Placeholder to be shown if no value has been selected. */
  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string;

  /** Whether the component is required. */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;
  static ngAcceptInputType_required: BooleanInput;

  /**
   * Function to compare the option values with the selected values. The first argument
   * is a value from an option. The second is a value from the selection. A boolean
   * should be returned.
   * Defaults to value equality.
   */
  @Input()
  get compareWith(): (v1: T, v2: T) => boolean {
    return this._compareWith;
  }
  set compareWith(fn: (v1: T, v2: T) => boolean) {
    // eslint-disable-next-line
    if (typeof fn !== 'function') {
      LOG.error(DT_COMPARE_WITH_NON_FUNCTION_VALUE_ERROR_MSG);
    } else {
      this._compareWith = fn;
    }

    if (this._selectionModel) {
      // A different comparator means the selection could change.
      this._initializeSelection();
    }
  }
  private _compareWith = (v1: T, v2: T) => v1 === v2;

  /** Value of the select control. */
  @Input()
  get value(): T {
    return this._value;
  }
  set value(newValue: T) {
    if (newValue !== this._value) {
      this.writeValue(newValue);
      this._value = newValue;
    }
  }
  private _value: T;

  /** Unique id of the element. */
  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
    this.stateChanges.next();
  }
  private _id: string;

  /** Aria label of the select. If not specified, the placeholder will be used as label. */
  @Input('aria-label') ariaLabel = '';

  /** Input that can be used to specify the `aria-labelledby` attribute. */
  @Input('aria-labelledby') ariaLabelledby: string;

  /** Object used to control when error messages are shown. */
  @Input() errorStateMatcher: ErrorStateMatcher;

  /** Classes to be passed to the select panel. Supports the same syntax as `ngClass`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() panelClass: string | string[] | Set<string> | { [key: string]: any };

  /** Combined stream of all of the child options' change events. */
  readonly optionSelectionChanges: Observable<DtOptionSelectionChange<T>> =
    defer(() => {
      if (this.options) {
        return merge<DtOptionSelectionChange<T>>(
          ...this.options.map((option) => option.selectionChange),
        );
      }

      return this._ngZone.onStable.asObservable().pipe(
        take(1),
        switchMap(() => this.optionSelectionChanges),
      );
    });

  /** Event emitted when the select panel has been toggled. */
  @Output() readonly openedChange = new EventEmitter<boolean>();

  /** Event emitted when the selected value has been changed by the user. */
  @Output() readonly selectionChange = new EventEmitter<DtSelectChange<T>>();

  /** Event that emits whenever the raw value of the select changes. */
  @Output() readonly valueChange = new EventEmitter<T>();

  /** Trigger that opens the select. */
  @ViewChild('trigger') trigger: ElementRef;

  /** Panel containing the select options. */
  @ViewChild('panel') panel: ElementRef;

  /** Overlay pane containing the options. */
  @ViewChild(CdkConnectedOverlay)
  overlayDir: CdkConnectedOverlay;

  /** @internal Custom trigger template. */
  @ContentChild(DtSelectValueTemplate)
  _customValueTemplate: DtSelectValueTemplate;

  /** All of the defined select options. */
  @ContentChildren(DtOption, { descendants: true }) options: QueryList<
    DtOption<T>
  >;

  /** All of the defined groups of options. */
  @ContentChildren(DtOptgroup) optionGroups: QueryList<DtOptgroup>;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    elementRef: ElementRef,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    @Optional() private _parentFormField: DtFormField<T>,
    @Self() @Optional() public ngControl: NgControl,
    @Attribute('tabindex') tabIndex: string,
    private _focusMonitor: FocusMonitor,
    @Optional()
    @Inject(DT_UI_TEST_CONFIG)
    private _config?: DtUiTestConfiguration,
  ) {
    super(
      elementRef,
      _defaultErrorStateMatcher,
      _parentForm,
      _parentFormGroup,
      ngControl,
    );

    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    this.tabIndex = parseInt(tabIndex, 10) || 0;

    // Force setter to be called in case id was not specified.
    // eslint-disable-next-line no-self-assign
    this.id = this.id;

    this._focusMonitor.monitor(this._elementRef, false);
  }

  ngOnInit(): void {
    this._selectionModel = new SelectionModel<DtOption<T>>();
    this.stateChanges.next();

    // We need `distinctUntilChanged` here, because some browsers will
    // fire the animation end event twice for the same animation. See:
    // https://github.com/angular/angular/issues/24084
    this._panelDoneAnimatingStream
      .pipe(distinctUntilChanged(), takeUntil(this._destroy))
      .subscribe(() => {
        if (this.panelOpen) {
          this._scrollTop = 0;
          this.openedChange.emit(true);
        } else {
          this.openedChange.emit(false);
          this._panelDoneAnimating = false;
          // this.overlayDir.offsetX = 0;
          this._changeDetectorRef.markForCheck();
        }
      });
  }

  ngAfterContentInit(): void {
    this._initKeyManager();

    this._selectionModel.changed
      .pipe(takeUntil(this._destroy))
      .subscribe((event) => {
        event.added.forEach((option) => {
          option.select();
        });
        event.removed.forEach((option) => {
          option.deselect();
        });
      });

    this.options.changes
      .pipe(startWith(null), takeUntil(this._destroy))
      .subscribe(() => {
        this._initializeSelection();
        this._resetOptions();
      });
  }

  ngDoCheck(): void {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Updating the disabled state is handled by `mixinDisabled`, but we need to additionally let
    // the parent form field know to run change detection when the disabled state changes.
    if (changes.disabled) {
      this.stateChanges.next();
    }
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  /** Toggles the overlay panel open or closed. */
  toggle(): void {
    if (this.panelOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /** Opens the overlay panel. */
  open(): void {
    if (
      this.disabled ||
      !this.options ||
      !this.options.length ||
      this._panelOpen
    ) {
      return;
    }

    this._triggerRect = this.trigger.nativeElement.getBoundingClientRect();
    this._panelOpen = true;
    this._keyManager.withHorizontalOrientation(null);
    this._calculateOverlayPosition();
    this._highlightCorrectOption();
    this._changeDetectorRef.markForCheck();
  }

  /** Closes the overlay panel and focuses the host element. */
  close(): void {
    if (this._panelOpen) {
      this._panelOpen = false;
      this._keyManager.withHorizontalOrientation('ltr');
      this._changeDetectorRef.markForCheck();
      this._onTouched();
    }
  }

  /** Focuses the select element. */
  focus(): void {
    this._elementRef.nativeElement.focus();
  }

  /** Sets the select's value. Part of the ControlValueAccessor. */
  writeValue(value: T): void {
    if (this.options) {
      this._setSelectionByValue(value);
    }
  }

  /**
   * Saves a callback function to be invoked when the select's value
   * changes from user input. Part of the ControlValueAccessor.
   */
  registerOnChange(fn: (value: T) => void): void {
    this._onChange = fn;
  }

  /**
   * Saves a callback function to be invoked when the select is blurred
   * by the user. Part of the ControlValueAccessor.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  /** Disables the select. Part of the ControlValueAccessor. */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next();
  }

  /** Implemented as part of DtFormFieldControl. */
  setDescribedByIds(ids: string[]): void {
    this._ariaDescribedby = ids.join(' ');
  }

  /** Implemented as part of DtFormFieldControl. */
  onContainerClick(): void {
    this.focus();
    this.open();
  }

  /** @internal Handles all keydown events on the select. */
  _handleKeydown(event: KeyboardEvent): void {
    if (!this.disabled) {
      if (this.panelOpen) {
        this._handleOpenKeydown(event);
      } else {
        this._handleClosedKeydown(event);
      }
    }
  }

  /** @internal Handles the focus of the select element. */
  _onFocus(): void {
    if (!this.disabled) {
      this._focused = true;
      this.stateChanges.next();
    }
  }

  /** @internal Handles leaving the focus of the select element. */
  _onBlur(): void {
    this._focused = false;

    if (!this.disabled && !this.panelOpen) {
      this._onTouched();
      this._changeDetectorRef.markForCheck();
      this.stateChanges.next();
    }
  }

  /** @internal Callback that is invoked when the overlay panel has been attached. */
  _onAttached(): void {
    this.overlayDir.positionChange.pipe(take(1)).subscribe(() => {
      this._changeDetectorRef.detectChanges();
      this.panel.nativeElement.scrollTop = this._scrollTop;
    });
    dtSetUiTestAttribute(
      this.overlayDir.overlayRef.overlayElement,
      this.overlayDir.overlayRef.overlayElement.id,
      this._elementRef,
      this._config,
    );
  }

  /**
   * @internal
   * When the panel content is done fading in, the _panelDoneAnimating property is
   * set so the proper class can be added to the panel.
   */
  _onFadeInDone(): void {
    this._panelDoneAnimating = this.panelOpen;
    this._changeDetectorRef.markForCheck();
  }

  /** @internal Returns the aria-label of the select component. */
  _getAriaLabel(): string | null {
    // If an ariaLabelledby value has been set by the consumer, the select should not overwrite the
    // `aria-labelledby` value by setting the ariaLabel to the placeholder.
    return this.ariaLabelledby ? null : this.ariaLabel || this.placeholder;
  }

  /** @internal Returns the aria-labelledby of the select component. */
  _getAriaLabelledby(): string | null {
    if (this.ariaLabelledby) {
      return this.ariaLabelledby;
    }

    // Note: we use `_getAriaLabel` here, because we want to check whether there's a
    // computed label. `this.ariaLabel` is only the user-specified label.
    if (!this._parentFormField || this._getAriaLabel()) {
      return null;
    }

    return this._parentFormField._labelId || null;
  }

  /** @internal Determines the `aria-activedescendant` to be set on the host. */
  _getAriaActiveDescendant(): string | null {
    if (this.panelOpen && this._keyManager && this._keyManager.activeItem) {
      return this._keyManager.activeItem.id;
    }

    return null;
  }

  /** Invoked when an option is clicked. */
  private _onSelect(option: DtOption<T>, isUserInput: boolean): void {
    const wasSelected = this._selectionModel.isSelected(option);

    if (isDefined(option.value)) {
      if (option.selected) {
        this._selectionModel.select(option);
      } else {
        this._selectionModel.deselect(option);
      }

      if (isUserInput) {
        this._keyManager.setActiveItem(option);
      }
    } else {
      option.deselect();
      this._selectionModel.clear();
      this._propagateChanges(option.value);
    }

    if (wasSelected !== this._selectionModel.isSelected(option)) {
      this._propagateChanges();
    }

    this.stateChanges.next();
  }

  /** Emits change event to set the model value. */
  private _propagateChanges(fallbackValue?: T): void {
    const valueToEmit = this.selected ? this.selected.value : fallbackValue;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._value = valueToEmit!;
    this.valueChange.emit(valueToEmit);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._onChange(valueToEmit!);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.selectionChange.emit(new DtSelectChange(this, valueToEmit!));
    this._changeDetectorRef.markForCheck();
  }

  /** Handles keyboard events while the select is closed. */
  private _handleClosedKeydown(event: KeyboardEvent): void {
    const keyCode = _readKeyCode(event);
    const isArrowKey =
      keyCode === DOWN_ARROW ||
      keyCode === UP_ARROW ||
      keyCode === LEFT_ARROW ||
      keyCode === RIGHT_ARROW;
    const isOpenKey = keyCode === ENTER || keyCode === SPACE;

    // Open the select on ALT + arrow key to match the native <select>
    if (isOpenKey || (event.altKey && isArrowKey)) {
      event.preventDefault(); // prevents the page from scrolling down when pressing space
      this.open();
    } else {
      this._keyManager.onKeydown(event);
    }
  }

  /** Handles keyboard events when the selected is open. */
  private _handleOpenKeydown(event: KeyboardEvent): void {
    const keyCode = _readKeyCode(event);
    const isArrowKey = keyCode === DOWN_ARROW || keyCode === UP_ARROW;
    const manager = this._keyManager;

    if (keyCode === HOME) {
      event.preventDefault();
      manager.setFirstItemActive();
    } else if (keyCode === END) {
      event.preventDefault();
      manager.setLastItemActive();
    } else if (isArrowKey && event.altKey) {
      // Close the select on ALT + arrow key to match the native <select>
      event.preventDefault();
      this.close();
    } else if ((keyCode === ENTER || keyCode === SPACE) && manager.activeItem) {
      event.preventDefault();
      manager.activeItem._selectViaInteraction();
    } else {
      manager.onKeydown(event);
    }
  }

  /** Sets up a key manager to listen to keyboard events on the overlay panel. */
  private _initKeyManager(): void {
    this._keyManager = new ActiveDescendantKeyManager<DtOption<T>>(this.options)
      .withTypeAhead()
      .withVerticalOrientation()
      .withHorizontalOrientation('ltr');

    this._keyManager.tabOut.pipe(takeUntil(this._destroy)).subscribe(() => {
      // Restore focus to the trigger before closing. Ensures that the focus
      // position won't be lost if the user got focus into the overlay.
      this.focus();
      this.close();
    });

    this._keyManager.change.pipe(takeUntil(this._destroy)).subscribe(() => {
      if (this._panelOpen && this.panel) {
        this._scrollActiveOptionIntoView();
      } else if (!this._panelOpen && this._keyManager.activeItem) {
        this._keyManager.activeItem._selectViaInteraction();
      }
    });
  }

  private _initializeSelection(): void {
    // Defer setting the value in order to avoid the "Expression
    // has changed after it was checked" errors from Angular.
    Promise.resolve().then(() => {
      this._setSelectionByValue(
        this.ngControl ? this.ngControl.value : this._value,
      );
    });
  }

  private _selectValue(value: T): DtOption<T> | undefined {
    const correspondingOption = this.options.find((option: DtOption<T>) => {
      try {
        // Treat null as a special reset value.
        return (
          isDefined(option.value) && this._compareWith(option.value, value)
        );
      } catch (error) {
        // Notify developers of errors in their comparator.
        LOG.warn(error);
        return false;
      }
    });

    if (correspondingOption) {
      this._selectionModel.select(correspondingOption);
    }

    return correspondingOption;
  }

  private _setSelectionByValue(value: T): void {
    this._selectionModel.clear();
    const correspondingOption = this._selectValue(value);

    // Shift focus to the active item. Note that we shouldn't do this in multiple
    // mode, because we don't know what option the user interacted with last.
    if (correspondingOption) {
      this._keyManager.setActiveItem(correspondingOption);
    }

    this._changeDetectorRef.markForCheck();
  }

  /** Calculates the scroll position and the offset of the overlay panel. */
  private _calculateOverlayPosition(): void {
    const items = this._getItemCount();
    const panelHeight = Math.min(
      items * SELECT_ITEM_HEIGHT,
      SELECT_PANEL_MAX_HEIGHT,
    );
    const scrollContainerHeight = items * SELECT_ITEM_HEIGHT;

    // The farthest the panel can be scrolled before it hits the bottom
    const maxScroll = scrollContainerHeight - panelHeight;

    // If no value is selected we open the popup to the first item.
    let selectedOptionOffset = this.empty
      ? 0
      : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this._getOptionIndex(this._selectionModel.selected[0])!;
    selectedOptionOffset += _countGroupLabelsBeforeOption(
      selectedOptionOffset,
      this.options.toArray(),
    );

    // We must maintain a scroll buffer so the selected option will be scrolled to the
    // center of the overlay panel rather than the top.
    // eslint-disable-next-line no-magic-numbers
    const scrollBuffer = panelHeight / 2;
    this._scrollTop = this._calculateOverlayScroll(
      selectedOptionOffset,
      scrollBuffer,
      maxScroll,
    );
    // this._offsetY = this._calculateOverlayOffsetY(selectedOptionOffset, scrollBuffer, maxScroll);
  }

  private _calculateOverlayScroll(
    selectedIndex: number,
    scrollBuffer: number,
    maxScroll: number,
  ): number {
    const optionOffsetFromScrollTop = SELECT_ITEM_HEIGHT * selectedIndex;
    // eslint-disable-next-line no-magic-numbers
    const halfOptionHeight = SELECT_ITEM_HEIGHT / 2;

    // Starts at the optionOffsetFromScrollTop, which scrolls the option to the top of the
    // scroll container, then subtracts the scroll buffer to scroll the option down to
    // the center of the overlay panel. Half the option height must be re-added to the
    // scrollTop so the option is centered based on its middle, not its top edge.
    const optimalScrollPosition =
      optionOffsetFromScrollTop - scrollBuffer + halfOptionHeight;
    return Math.min(Math.max(0, optimalScrollPosition), maxScroll);
  }

  private _scrollActiveOptionIntoView(): void {
    const activeOptionIndex = this._keyManager.activeItemIndex || 0;
    const labelCount = _countGroupLabelsBeforeOption(
      activeOptionIndex,
      this.options.toArray(),
    );

    this.panel.nativeElement.scrollTop = _getOptionScrollPosition(
      activeOptionIndex + labelCount,
      SELECT_ITEM_HEIGHT,
      this.panel.nativeElement.scrollTop,
      SELECT_PANEL_MAX_HEIGHT,
    );
  }

  private _getOptionIndex(option: DtOption<T>): number | undefined {
    const result = this.options
      .toArray()
      .findIndex((current: DtOption<T>) => option === current);
    return result !== -1 ? result : undefined;
  }

  private _resetOptions(): void {
    const changedOrDestroyed = merge(this.options.changes, this._destroy);

    this.optionSelectionChanges
      .pipe(takeUntil(changedOrDestroyed))
      .subscribe((event) => {
        this._onSelect(event.source, event.isUserInput);

        if (event.isUserInput && this._panelOpen) {
          this.close();
          this.focus();
        }
      });

    // Listen to changes in the internal state of the options and react accordingly.
    // Handles cases like the labels of the selected options changing.
    merge(...this.options.map((option) => option._stateChanges))
      .pipe(takeUntil(changedOrDestroyed))
      .subscribe(() => {
        this._changeDetectorRef.markForCheck();
        this.stateChanges.next();
      });

    this._setOptionIds();
  }

  private _highlightCorrectOption(): void {
    if (this._keyManager) {
      if (this.empty) {
        this._keyManager.setFirstItemActive();
      } else {
        this._keyManager.setActiveItem(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this._getOptionIndex(this._selectionModel.selected[0])!,
        );
      }
    }
  }

  /** Records option IDs to pass to the aria-owns property. */
  private _setOptionIds(): void {
    this._optionIds = this.options.map((option) => option.id).join(' ');
  }

  /** Calculates the amount of items in the select. This includes options and group labels. */
  private _getItemCount(): number {
    return this.options.length + this.optionGroups.length;
  }
}
