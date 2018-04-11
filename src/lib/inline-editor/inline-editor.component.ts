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

const MODES = {
  IDLE: 0,
  EDITING: 1,
  DISABLED: 2
}

@Component({
  // changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  // tslint:disable-next-line:component-selector
  selector: "[dt-inline-editor]",
  styleUrls: ["./inline-editor.component.scss"],
  template: `
    <span *ngIf="!isEditing()">{{ value }}</span>
    <input #input
      *ngIf="isEditing()"
      [value]="value"
      (change)="onChange()"
      (keyup)="onChange()" />
    <button type="button" *ngIf="!isEditing()" (click)="enterEditing()">edit</button>
    <button type="button" *ngIf="isEditing()" (click)="saveAndQuitEditing()">save</button>
    <button type="button" *ngIf="isEditing()" (click)="cancelAndQuitEditing()">cancel</button>
  `,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DtInlineEditor), multi: true }
  ]
})
export class DtInlineEditor implements ControlValueAccessor {

  private innerValue: string = '';
  private changed = new Array<(value: string) => void>();
  private touched = new Array<() => void>();
  private initialState: string;
  private mode = MODES.IDLE;

  @ViewChild('input') inputReference: ElementRef;

  @HostBinding("attr.disabled")
  private get disabledBinding(): true | undefined {
    //return this.disabled ? this.disabled : undefined;
    return undefined
  }

  private onChange() {
    this.value = this.inputReference.nativeElement.value;
  }

  // Public API

  public enterEditing() {
    this.initialState = this.value;
    this.mode = MODES.EDITING;
    this.touch();
  }

  public saveAndQuitEditing() {
    this.mode = MODES.IDLE;
  }

  public cancelAndQuitEditing() {
    this.value = this.initialState;
    this.mode = MODES.IDLE;
  }

  public isEditing() {
    return this.mode === MODES.EDITING;
  }

  public isDisabled() {
    return this.mode === MODES.DISABLED;
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
