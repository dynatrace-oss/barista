import {
  state,
  style,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
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
  readKeyCode,
} from '@dynatrace/angular-components/core';
import { DtError } from '@dynatrace/angular-components/form-field';
import { DtInput } from '@dynatrace/angular-components/input';

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
  moduleId: module.id,
  preserveWhitespaces: false,
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
export class DtInlineEditor extends _DtInlineEditorMixinBase
  implements
    ControlValueAccessor,
    OnDestroy,
    DoCheck,
    AfterContentInit,
    AfterViewInit,
    CanUpdateErrorState {
  /** Wether the inline editor is required */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }

  /** Aria label of the inline-editor's save button. */
  @Input('aria-label-save') ariaLabelSave: string;
  /** Aria label of the inline-editor's cancel button. */
  @Input('aria-label-cancel') ariaLabelCancel: string;

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

  /** @internal Wether the input is focused or not */
  _inputFocused = false;

  /** @internal State of the dt-error animations. */
  _errorAnimationState: '' | 'enter' | 'enter-delayed' = '';

  /** @internal the input's elementref */
  @ViewChildren(DtInput) _input: QueryList<DtInput>;
  /** @internal the edit button */
  @ViewChild('edit', { static: false }) _editButtonReference: ElementRef;
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
    // tslint:disable-next-line: strict-type-predicates
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
      .pipe(
        startWith(null),
        takeUntil(this._destroy$),
      )
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

  /** @deprecated Will be removed in 6.0.0 */
  onKeyDown(event: KeyboardEvent): void {
    this._onKeyDown(event);
  }

  /** Enters the edit mode */
  enterEditing(): void {
    this._initialState = this.value;
    this._mode = MODES.EDITING;
    this._onTouched();
    this._focusWhenStable();

    this._changeDetectorRef.markForCheck();
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
        error => {
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
    switch (readKeyCode(event)) {
      case ESCAPE:
        this.cancelAndQuitEditing();
      case ENTER:
        this.saveAndQuitEditing();
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

  // tslint:disable-next-line:no-any
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
      this._ngZone.onStable
        .asObservable()
        .pipe(take(1))
        .subscribe(fn);
    }
  }
}
