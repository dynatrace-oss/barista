import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  forwardRef,
  AfterViewChecked
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

const MODES = {
  IDLE: 0,
  EDITING: 1,
  SAVING: 2
}

@Component({
  preserveWhitespaces: false,
  selector: "[dt-inline-editor]",
  styleUrls: ["./inline-editor.component.scss"],
  template: `
    <span *ngIf="isIdle()">{{ value }}</span>
    <input dtInput #input
      *ngIf="isEditing() || isSaving()"
      [disabled]="isSaving()"
      [value]="value"
      (change)="onChange()"
      (keyup)="onChange()" />
    <button dt-button #edit type="button" *ngIf="isIdle()" (click)="enterEditing()">edit</button>

    <dt-loading-spinner *ngIf="isSaving()"></dt-loading-spinner>

    <button dt-button type="button"
      *ngIf="isEditing()"
      (click)="saveAndQuitEditing()">save</button>
    <button dt-button variant="secondary" type="button"
      *ngIf="isEditing()"
      (click)="cancelAndQuitEditing()">cancel</button>
  `,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DtInlineEditor), multi: true }
  ]
})
export class DtInlineEditor implements ControlValueAccessor, AfterViewChecked, OnDestroy {

  private changed = new Array<(value: string) => void>();
  private touched = new Array<() => void>();
  private initialState: string;
  private mode = MODES.IDLE;
  private modeOnLastCheck = MODES.IDLE;

  private $saving: any;

  @ViewChild('input') inputReference: ElementRef;
  @ViewChild('edit') editButtonReference: ElementRef;

  @Input('onSave') onSaveFunction: (result: { value: string }) => Observable<void>;
  @Output('enterEditing') enterEditingEvent = new EventEmitter<{ value: string }>();
  @Output('quitEditing') quitEditingEvent = new EventEmitter<{ value: string }>();
  @Output('save') saveEvent = new EventEmitter<{ value: string }>();
  @Output('cancel') cancelEvent = new EventEmitter<{ value: string }>();
  @Output('saved') savedEvent = new EventEmitter<{ value: string }>();
  @Output('failed') failedEvent = new EventEmitter<{ value: string, error: any }>();

  public ngOnDestroy() {
    if (this.$saving) {
      this.$saving.unsubscribe();
      this.$saving = null;
    }
  }

  private onChange() {
    this.value = this.inputReference.nativeElement.value;
  }

  ngAfterViewChecked() {
    if (this.mode !== this.modeOnLastCheck) {
      this.setFocusToEditControls();
      this.modeOnLastCheck = this.mode;
    }
  }

  private setFocusToEditControls() {
    if (this.mode === MODES.EDITING) {
      this.inputReference.nativeElement.focus();
    } else if (this.mode === MODES.IDLE) {
      this.editButtonReference.nativeElement.focus();
    }
  }


  // Public API

  public enterEditing() {
    this.initialState = this.value;
    this.mode = MODES.EDITING;
    this.touch();

    // Better to trigger it where input is shown already
    this.enterEditingEvent.emit({ value: this.value });
  }

  public saveAndQuitEditing() {
    const value = this.value

    this.saveEvent.emit({ value });

    if (this.onSaveFunction) {
      this.mode = MODES.SAVING;
      this.$saving = this.onSaveFunction({ value })
        .subscribe(
          () => {
            this.mode = MODES.IDLE;
            this.savedEvent.emit({ value });
            this.quitEditingEvent.emit({ value });
            this.$saving = null;
          },
          (error) => {
            this.mode = MODES.EDITING;
            this.failedEvent.emit({ value, error });
            this.$saving = null;
          }
        );
    } else {
      this.mode = MODES.IDLE;
    }
  }

  public cancelAndQuitEditing() {
    const value = this.value;
    this.value = this.initialState;
    this.mode = MODES.IDLE;
    // Triggered with the value that was canceled
    this.cancelEvent.emit({ value });
    // Triggered with the actual value
    this.quitEditingEvent.emit({ value: this.value });
  }

  public isIdle() {
    return this.mode === MODES.IDLE;
  }

  public isEditing() {
    return this.mode === MODES.EDITING;
  }

  public isSaving() {
    return this.mode === MODES.SAVING;
  }

  // Data binding

  private _value: string = '';

  private set value(value: string) {
    if (this._value !== value) {
      this._value = value
      this.changed.forEach(f => f(value))
    }
  }

  private get value() {
    return this._value
  }

  private touch() {
    this.touched.forEach(f => f());
  }

  public writeValue(value: string) {
    this._value = value;
  }

  public registerOnChange(fn: (value: string) => void) {
    this.changed.push(fn)
  }

  public registerOnTouched(fn: () => void) {
    this.touched.push(fn)
  }
}
