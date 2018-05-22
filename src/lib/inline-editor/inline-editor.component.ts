import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  forwardRef,
  AfterViewChecked,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,

} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { take } from 'rxjs/operators/take';

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
  styleUrls: ['./inline-editor.component.scss'],
  templateUrl: './inline-editor.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // tslint:disable-next-line:no-forward-ref
      useExisting: forwardRef(() => DtInlineEditor),
      multi: true },
  ],
})
export class DtInlineEditor implements ControlValueAccessor, OnDestroy {

  private _onChanged: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};
  private _initialState: string;
  private _mode = MODES.IDLE;
  private _value = '';
  private _saving: Subscription | null;

  @ViewChild('input') inputReference: ElementRef;
  @ViewChild('edit') editButtonReference: ElementRef;

  @Input() onRemoteSave: (value: string) => Observable<void>;
  @Output() saved = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<string>();

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

  ngOnDestroy(): void {
    if (this._saving) {
      this._saving.unsubscribe();
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
    const value = this.value;

    if (this.onRemoteSave) {
      this._mode = MODES.SAVING;
      this._saving = this.onRemoteSave(value).subscribe(
        () => this._emitValue(value),
        (error) => this._emitError(error));
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
    if (this._mode === MODES.EDITING && this.inputReference) {
      this.inputReference.nativeElement.focus();
    } else if (this._mode === MODES.IDLE && this.editButtonReference) {
      this.editButtonReference.nativeElement.focus();
    }
  }

  /** Handles the native input change */
  _onInputChange(): void {
    this.value = this.inputReference.nativeElement.value;
  }

  private _emitValue(value: string): void {
    this._mode = MODES.IDLE;
    this.saved.emit(this.value);
    this._changeDetectorRef.markForCheck();
  }

  // tslint:disable-next-line:no-any
  private _emitError(error: any): void {
    this._mode = MODES.EDITING;
    this.saved.error(error);
    this._changeDetectorRef.markForCheck();
  }

  private _focusWhenStable(): void {
    this._executeOnStable(() => this.focus());
  }

  private _executeOnStable(fn: () => void): void {
    if (this._ngZone.isStable) {
      fn();
    } else {
      this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(fn);
    }
  }
}
