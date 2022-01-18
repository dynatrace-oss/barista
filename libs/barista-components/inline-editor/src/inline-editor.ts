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
  state,
  style,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
import { ENTER, ESCAPE } from '@angular/cdk/keycodes';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  Self,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm,
} from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, startWith, switchMap, take, takeUntil } from 'rxjs/operators';

import {
  CanUpdateErrorState,
  DT_ERROR_ENTER_ANIMATION,
  DT_ERROR_ENTER_DELAYED_ANIMATION,
  ErrorStateMatcher,
  mixinErrorState,
  _readKeyCode,
} from '@dynatrace/barista-components/core';
import { DtError } from '@dynatrace/barista-components/form-field';
import { DtInput } from '@dynatrace/barista-components/input';

// eslint-disable-next-line no-shadow
const enum MODES {
  IDLE,
  EDITING,
  SAVING,
}

// Boilerplate for applying mixins to DtInput.
export class DtInlineEditorBase {
  constructor(
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl,
  ) {}
}
export const _DtInlineEditorMixinBase = mixinErrorState(DtInlineEditorBase);

@Component({
  preserveWhitespaces: false,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[dt-inline-editor]',
  exportAs: 'dt-inline-editor',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./inline-editor.scss'],
  templateUrl: './inline-editor.html',
  host: {
    class: 'dt-inline-editor',
    '[class.dt-focused]': '_inputFocused',
    '[class.dt-inline-editor-invalid]': 'ngControl && ngControl.invalid',
  },
  animations: [
    trigger('transitionErrors', [
      state('enter', style({ opacity: 1, transform: 'scaleY(1)' })),
      transition('void => enter', [useAnimation(DT_ERROR_ENTER_ANIMATION)]),
      transition('void => enter-delayed', [
        useAnimation(DT_ERROR_ENTER_DELAYED_ANIMATION),
      ]),
    ]),
  ],
})
export class DtInlineEditor
  extends _DtInlineEditorMixinBase
  implements
    ControlValueAccessor,
    OnDestroy,
    DoCheck,
    AfterContentInit,
    AfterViewInit,
    CanUpdateErrorState
{
  /** Wether the inline editor is required */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }
  static ngAcceptInputType_required: BooleanInput;

  /** Aria label of the inline-editor's save button. */
  @Input()
  get ariaLabelSave(): string {
    return this._ariaLabelSave;
  }
  set ariaLabelSave(value: string) {
    this._ariaLabelSave = value;
  }
  /** @internal Aria label for the save button. */
  _ariaLabelSave: string;

  /** Aria label of the inline-editor's cancel button. */
  @Input()
  get ariaLabelCancel(): string {
    return this._ariaLabelCancel;
  }
  set ariaLabelCancel(value: string) {
    this._ariaLabelCancel = value;
  }
  /** @internal Aria label for the cancel button. */
  _ariaLabelCancel: string;

  /** An object used to control when error messages are shown. */
  @Input() errorStateMatcher: ErrorStateMatcher;

  /** The value of the inline editor */
  @Input()
  get value(): string {
    return this._value;
  }
  set value(value: string) {
    if (this._value !== value) {
      this._value = value;
      this._onChanged(value);
      this._changeDetectorRef.markForCheck();
    }
  }

  /** The callback function that returns an observable that emits when the async save operation is done */
  @Input() onRemoteSave: (value: string) => Observable<void>;

  /** A stream that emits when the inline editor save operation is done */
  @Output() readonly saved = new EventEmitter<string>();
  /** A stream that emits when the inline editor cancel operation is done */
  @Output() readonly cancelled = new EventEmitter<string>();

  /** Wether the editor is in idle mode */
  get idle(): boolean {
    return this._mode === MODES.IDLE;
  }
  /** Wether the editor is in editing mode */
  get editing(): boolean {
    return this._mode === MODES.EDITING;
  }
  /** Wether the editor is in saving mode */
  get saving(): boolean {
    return this._mode === MODES.SAVING;
  }

  /** @internal Measured input width to match it for the error overlay width */
  _inputWidth = 0;

  /** @internal Wether the input is focused or not */
  _inputFocused = false;

  /** @internal State of the dt-error animations. */
  _errorAnimationState: '' | 'enter' | 'enter-delayed' = '';

  /** @internal the input's elementref */
  @ViewChildren(DtInput) _input: QueryList<DtInput>;
  /** @internal the edit button */
  @ViewChild('edit') _editButtonReference: ElementRef;
  /** @internal Root of the error overlay */
  @ViewChild('origin', { read: ElementRef }) origin: ElementRef;
  /** @internal list of all errors passed as content children */
  @ContentChildren(DtError) _errorChildren: QueryList<DtError>;

  private _onChanged: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};
  private _initialState: string;
  private _mode = MODES.IDLE;
  private _value = '';
  private _saving: Subscription | null;
  private _required = false;
  private _destroy$ = new Subject<void>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone,
    defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional() @Self() public ngControl: NgControl,
    @Optional() parentForm: NgForm,
    @Optional() parentFormGroup: FormGroupDirective,
  ) {
    super(defaultErrorStateMatcher, parentForm, parentFormGroup, ngControl);
    // Replace the provider from above with this.
    // eslint-disable-next-line
    if (this.ngControl !== null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
  }

  ngDoCheck(): void {
    if (this.ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean or we risk destroying the performance.
      this.updateErrorState();
    }
  }

  ngAfterContentInit(): void {
    // Update the error animation state
    this._errorChildren.changes.pipe(startWith(null)).subscribe(() => {
      this._errorAnimationState =
        this._getDisplayedError() && this._inputFocused
          ? 'enter-delayed'
          : 'enter';
      this._changeDetectorRef.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    // We need to pipe the ngControl through to the input so the updateErrorState method is called on the input
    // and the host bindings on the input are updated correctly
    this._input.changes
      .pipe(startWith(null), takeUntil(this._destroy$))
      .subscribe(() => {
        const input = this._input.first;
        if (input) {
          input.ngControl = this.ngControl;
        }
      });

    this._input.changes
      .pipe(
        startWith(null),
        filter(() => !!this._input.first),
        switchMap(() => this._input.first.stateChanges),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        if (
          this._inputFocused !== this._input.first.focused &&
          this._mode === MODES.EDITING
        ) {
          this._inputFocused = this._input.first.focused;
          this._changeDetectorRef.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    if (this._saving) {
      this._saving.unsubscribe();
    }
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** Enters the edit mode */
  enterEditing(): void {
    this._initialState = this.value;
    this._mode = MODES.EDITING;
    this._onTouched();
    this._focusWhenStable();
    this._changeDetectorRef.markForCheck();
    this._executeOnStable(() => {
      if (this.origin) {
        this._inputWidth =
          this.origin.nativeElement.getBoundingClientRect().width;
        this._changeDetectorRef.markForCheck();
      }
    });
  }

  /** Saves and quits the edit mode */
  saveAndQuitEditing(): void {
    if (this.errorState) {
      return;
    }

    const value = this.value;

    if (this.onRemoteSave) {
      this._mode = MODES.SAVING;
      this._saving = this.onRemoteSave(value).subscribe(
        () => {
          this._emitValue(value);
        },
        (error) => {
          this._emitError(error);
        },
      );
      this._changeDetectorRef.markForCheck();
    } else {
      this._emitValue(value);
    }
  }

  /** Cancels and quits the edit mode */
  cancelAndQuitEditing(): void {
    const value = this._value;
    this.value = this._initialState;
    this._mode = MODES.IDLE;
    this.cancelled.emit(value);
    this._changeDetectorRef.markForCheck();
  }

  /** Implemented as part of ControlValueAccessor */
  writeValue(value: string): void {
    this.value = value;
    this._changeDetectorRef.markForCheck();
  }

  /** Implemented as part of ControlValueAccessor */
  registerOnChange(fn: (value: string) => void): void {
    this._onChanged = fn;
  }

  /** Implemented as part of ControlValueAccessor */
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  /** Focuses the input or the button depending on the mode */
  focus(): void {
    if (this._mode === MODES.EDITING && this._input.length) {
      this._input.first.focus();
    } else if (this._mode === MODES.IDLE && this._editButtonReference) {
      this._editButtonReference.nativeElement.focus();
    }
  }

  /** @internal Keydown handler */
  _onKeyDown(event: KeyboardEvent): void {
    switch (_readKeyCode(event)) {
      case ESCAPE:
        this.cancelAndQuitEditing();
      // eslint-disable-next-line no-fallthrough
      case ENTER:
        this.saveAndQuitEditing();
        break;
      default:
    }
  }

  /** @internal input handler */
  _onInput(event: Event): void {
    this.writeValue((event.target as HTMLInputElement).value);
  }

  /** @internal Determines whether to display errors or not. */
  _getDisplayedError(): boolean {
    return (
      this._errorChildren && this._errorChildren.length > 0 && this.errorState
    );
  }

  private _emitValue(value: string): void {
    this._mode = MODES.IDLE;
    this.saved.emit(this.value);
    this._onChanged(value);
    this._changeDetectorRef.markForCheck();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _emitError(error: any): void {
    this._mode = MODES.EDITING;
    this.saved.error(error);
    this._changeDetectorRef.markForCheck();
  }

  private _focusWhenStable(): void {
    this._executeOnStable(() => {
      this.focus();
    });
  }

  private _executeOnStable(fn: () => void): void {
    if (this._ngZone.isStable) {
      fn();
    } else {
      this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(fn);
    }
  }
}
