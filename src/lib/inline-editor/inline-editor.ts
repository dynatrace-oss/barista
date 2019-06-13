import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  forwardRef,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
  ContentChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { DtFormField, DtError } from '@dynatrace/angular-components/form-field';
import { ErrorStateMatcher, readKeyCode } from '@dynatrace/angular-components/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Observable, Subscription } from 'rxjs';
import { take, map, startWith } from 'rxjs/operators';
import { ESCAPE, ENTER } from '@angular/cdk/keycodes';

const enum MODES {
  IDLE,
  EDITING,
  SAVING,
}

@Component({
  moduleId: module.id,
  preserveWhitespaces: false,
  selector: '[dt-inline-editor]',
  exportAs: 'dt-inline-editor',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./inline-editor.scss'],
  templateUrl: './inline-editor.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // tslint:disable-next-line:no-forward-ref
      useExisting: forwardRef(() => DtInlineEditor),
      multi: true },
  ],
})
export class DtInlineEditor implements ControlValueAccessor, OnDestroy, AfterViewInit {

  private _onChanged: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};
  private _initialState: string;
  private _mode = MODES.IDLE;
  private _value = '';
  private _saving: Subscription | null;
  private _required = false;
  _errorChildrenSource: Observable<DtError[]>;

  @ViewChild('input', { static: true }) _inputReference: ElementRef;
  @ViewChild('edit', { static: true }) _editButtonReference: ElementRef;
  @ViewChild(DtFormField, { static: true }) _formField: DtFormField<Input>;
  @ContentChildren(DtError) _errorChildren: QueryList<DtError>;

  @Input()
  get required(): boolean { return this._required; }
  set required(value: boolean) { this._required = coerceBooleanProperty(value); }

  /** Aria label of the inline-editor's save button. */
  @Input('aria-label-save') ariaLabelSave: string;
  /** Aria label of the inline-editor's cancel button. */
  @Input('aria-label-cancel') ariaLabelCancel: string;

  /** An object used to control when error messages are shown. */
  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() onRemoteSave: (value: string) => Observable<void>;
  @Output() readonly saved = new EventEmitter<string>();
  @Output() readonly cancelled = new EventEmitter<string>();

  get idle(): boolean { return this._mode === MODES.IDLE; }
  get editing(): boolean { return this._mode === MODES.EDITING; }
  get saving(): boolean { return this._mode === MODES.SAVING; }

  get value(): string { return this._value; }
  set value(value: string) {
    if (this._value !== value) {
      this._value = value;
      this._onChanged(value);
      this._changeDetectorRef.markForCheck();
    }
  }

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _ngZone: NgZone) { }

  ngAfterViewInit(): void {

    // In angular it is not yet possible to pass components via ng-content
    // multiple levels of components (in our case consumer -> inline-editor -> form-field)
    // To solve this we take the dt-error components passed in via ng-content and create
    // new onces (basically clone them) in the template.
    this._errorChildrenSource = this._errorChildren.changes.pipe(
      startWith(null),
      map(() => this._errorChildren.toArray()));
  }

  ngOnDestroy(): void {
    if (this._saving) {
      this._saving.unsubscribe();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    // tslint:disable-next-line:switch-default
    switch (readKeyCode(event)) {
      case ESCAPE: this.cancelAndQuitEditing();
      case ENTER: this.saveAndQuitEditing();
    }
  }

  enterEditing(): void {
    this._initialState = this.value;
    this._mode = MODES.EDITING;
    this._onTouched();
    this._focusWhenStable();

    this._changeDetectorRef.markForCheck();
  }

  saveAndQuitEditing(): void {
    if (this._formField._control.errorState) {
      return;
    }

    const value = this.value;

    if (this.onRemoteSave) {
      this._mode = MODES.SAVING;
      this._saving = this.onRemoteSave(value).subscribe(
        () => { this._emitValue(value); },
        (error) => { this._emitError(error); });
      this._changeDetectorRef.markForCheck();
    } else {
      this._emitValue(value);
    }
  }

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

  focus(): void {
    if (this._mode === MODES.EDITING && this._inputReference) {
      this._inputReference.nativeElement.focus();
    } else if (this._mode === MODES.IDLE && this._editButtonReference) {
      this._editButtonReference.nativeElement.focus();
    }
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
    this._executeOnStable(() => {this.focus(); });
  }

  private _executeOnStable(fn: () => void): void {
    if (this._ngZone.isStable) {
      fn();
    } else {
      this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(fn);
    }
  }
}
