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
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

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
export class DtInlineEditor implements ControlValueAccessor, AfterViewChecked, OnDestroy {

  private _onChanged: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};
  private _initialState: string;
  private _mode = MODES.IDLE;
  private _modeOnLastCheck = MODES.IDLE;

  private _saving: Subscription | null;

  @ViewChild('input') inputReference: ElementRef;
  @ViewChild('edit') editButtonReference: ElementRef;

  @Input() onSave: (value: string) => Observable<void>;
  @Output() saved = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<string>();

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    if (this._saving) {
      this._saving.unsubscribe();
    }
  }

  onChange(): void {
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

  // Public API /////////////////////////////////////
  enterEditing(): void {
    this._initialState = this._value;
    this._mode = MODES.EDITING;
    this._onTouched();

    this._changeDetectorRef.markForCheck();
  }

  saveAndQuitEditing(): void {
    const value = this._value;

    if (this.onSave) {
      this._mode = MODES.SAVING;
      this._saving = this.onSave(value)
        .subscribe(
          () => {
            this._mode = MODES.IDLE;
            this.saved.emit(value);
            this._changeDetectorRef.markForCheck();
          },
          (error) => {
            this._mode = MODES.EDITING;
            this.saved.error(error);
            this._changeDetectorRef.markForCheck();
          }
        );
    } else {
      this._mode = MODES.IDLE;
    }
    this._changeDetectorRef.markForCheck();
  }

  cancelAndQuitEditing(): void {
    const value = this._value;
    this._value = this._initialState;
    this._mode = MODES.IDLE;
    this.cancelled.emit(value);
    this._changeDetectorRef.markForCheck();
  }

  get idle(): boolean {
    return this._mode === MODES.IDLE;
  }

  get editing(): boolean {
    return this._mode === MODES.EDITING;
  }

  get saving(): boolean {
    return this._mode === MODES.SAVING;
  }

  // Data binding //////////////////////////////////////////////
  private _value = '';

  set value(value: string) {
    if (this._value !== value) {
      this._value = value;
      this._onChanged(value);
      this._changeDetectorRef.markForCheck();
    }
  }

  get value(): string {
    return this._value;
  }

  writeValue(value: string): void {
    this._value = value;
    this._changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChanged = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
}
