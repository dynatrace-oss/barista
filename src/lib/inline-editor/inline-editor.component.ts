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
  // ChangeDetectionStrategy,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

enum MODES {
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
  // changeDetection: ChangeDetectionStrategy.OnPush,
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
export class DtInlineEditor implements ControlValueAccessor, AfterViewChecked, OnDestroy {

  private _onChanged: (value: string) => void;
  private _onTouched: () => void;
  private _initialState: string;
  private _mode = MODES.IDLE;
  private _modeOnLastCheck = MODES.IDLE;

  private _$saving: Subscription | null;

  @ViewChild('input') inputReference: ElementRef;
  @ViewChild('edit') editButtonReference: ElementRef;

  @Input() onSave: (value: string) => Observable<void>;
  @Output() editing = new EventEmitter<string>();
  @Output() edited = new EventEmitter<string>();
  @Output() saving = new EventEmitter<string>();
  // tslint:disable-next-line:no-any
  @Output() saved = new EventEmitter<{ value: string; error: any } | null>();
  @Output() cancelled = new EventEmitter<string>();

  ngOnDestroy(): void {
    if (this._$saving) {
      this._$saving.unsubscribe();
    }
  }

  _onChange(): void {
    this._value = this.inputReference.nativeElement.value;
  }

  ngAfterViewChecked(): void {
    if (this._mode !== this._modeOnLastCheck) {
      this.focus();
      this._modeOnLastCheck = this._mode;
    }
  }

  private focus(): void {
    if (this._mode === MODES.EDITING) {
      if (this.inputReference.nativeElement) {
        this.inputReference.nativeElement.focus();
      }
    } else if (this._mode === MODES.IDLE) {
      if (this.editButtonReference.nativeElement) {
        this.editButtonReference.nativeElement.focus();
      }
    }
  }

  // Public API

  enterEditing(): void {
    this._initialState = this._value;
    this._mode = MODES.EDITING;
    this._onTouched();

    // Better to trigger it where input is shown already
    this.editing.emit(this._value);
  }

  saveAndQuitEditing(): void {
    const value = this._value;

    this.saving.emit(value);

    if (this.onSave) {
      this._mode = MODES.SAVING;
      this._$saving = this.onSave(value)
        .subscribe(
          () => {
            this._mode = MODES.IDLE;
            this.saved.emit();
            this.edited.emit(value);
          },
          (error) => {
            this._mode = MODES.EDITING;
            this.saved.emit({ value, error });
          }
        );
    } else {
      this._mode = MODES.IDLE;
    }
  }

  cancelAndQuitEditing(): void {
    const value = this._value;
    this._value = this._initialState;
    this._mode = MODES.IDLE;
    // Triggered with the value that was canceled
    this.cancelled.emit(value);
    // Triggered with the actual value
    this.edited.emit(this._value);
  }

  get isIdle(): boolean {
    return this._mode === MODES.IDLE;
  }

  get isEditing(): boolean {
    return this._mode === MODES.EDITING;
  }

  get isSaving(): boolean {
    return this._mode === MODES.SAVING;
  }

  // Data binding

  private _value = '';

  set value(value: string) {
    // ChangeDetectorRef.detectChanges();
    if (this._value !== value) {
      this._value = value;
      this._onChanged(value);
    }
  }

  get value(): string {
    return this._value;
  }

  writeValue(value: string): void {
    this._value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChanged = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
}
