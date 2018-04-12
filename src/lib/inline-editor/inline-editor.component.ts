import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewChild,
  forwardRef,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

const MODES = {
  IDLE: 0,
  EDITING: 1,
  SAVING: 2
}

@Component({
  // changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  // tslint:disable-next-line:component-selector
  selector: "[dt-inline-editor]",
  styleUrls: ["./inline-editor.component.scss"],
  template: `
    <span *ngIf="isIdle()">{{ value }}</span>
    <input #input
      *ngIf="isEditing() || isSaving()"
      [disabled]="isSaving()"
      [value]="value"
      (change)="onChange()"
      (keyup)="onChange()" />
    <button type="button" *ngIf="isIdle()" (click)="enterEditing()">edit</button>

    <span *ngIf="isSaving()"> (saving...)</span>

    <button type="button"
      *ngIf="isEditing() || isSaving()"
      [disabled]="isSaving()"
      (click)="saveAndQuitEditing()">save</button>
    <button type="button"
      *ngIf="isEditing() || isSaving()"
      [disabled]="isSaving()"
      (click)="cancelAndQuitEditing()">cancel</button>
  `,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DtInlineEditor), multi: true }
  ]
})
export class DtInlineEditor implements ControlValueAccessor {

  private changed = new Array<(value: string) => void>();
  private touched = new Array<() => void>();
  private initialState: string;
  private mode = MODES.IDLE;

  @ViewChild('input') inputReference: ElementRef;

  @Input('onSave') onSaveFunction: (result: { value: string }) => Observable<void>;
  @Output('enterEditing') enterEditingEvent = new EventEmitter<{ value: string }>();
  @Output('quitEditing') quitEditingEvent = new EventEmitter<{ value: string }>();
  @Output('save') saveEvent = new EventEmitter<{ value: string }>();
  @Output('cancel') cancelEvent = new EventEmitter<{ value: string }>();
  @Output('saved') savedEvent = new EventEmitter<{ value: string }>();
  @Output('failed') failedEvent = new EventEmitter<{ value: string, error: any }>();

  private onChange() {
    this.value = this.inputReference.nativeElement.value;
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
      this.onSaveFunction({ value })
        .subscribe(
          () => {
            this.mode = MODES.IDLE;
            this.savedEvent.emit({ value });
            this.quitEditingEvent.emit({ value });
          },
          (error) => {
            this.mode = MODES.EDITING;
            this.failedEvent.emit({ value, error });
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
