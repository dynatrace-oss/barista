import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from "@angular/core";

const MODES = {
  IDLE: 0,
  EDITING: 1,
  DISABLED: 2
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  // tslint:disable-next-line:component-selector
  selector: "[dt-inline-editor]",
  styleUrls: ["./inline-editor.component.scss"],
  template: `
    <span *ngIf="!isEditingMode()">{{ text }}</span>
    <input [(ngModel)]="text" *ngIf="isEditingMode()" />
    <button type="button" *ngIf="!isEditingMode()" (click)="enterEditingMode()">edit</button>
    <button type="button" *ngIf="isEditingMode()" (click)="saveAndQuitEditing()">save</button>
    <button type="button" *ngIf="isEditingMode()" (click)="cancelAndQuitEditing()">cancel</button>
  `,
})
export class DtInlineEditor  {

  private mode = MODES.IDLE;
  private initialState: string;

  @Input('dt-inline-editor') text: string = '';
  @Output('dt-inline-editorChange') textChange = new EventEmitter();

  @HostBinding("attr.disabled")
  private get disabledBinding(): true | undefined {
    //return this.disabled ? this.disabled : undefined;
    return undefined
  }

  public enterEditingMode() {
    this.mode = MODES.EDITING;
    this.initialState = this.text;
  }

  public saveAndQuitEditing() {
    this.mode = MODES.IDLE;
    this.textChange.emit(this.text);
  }

  public cancelAndQuitEditing() {
    this.text = this.initialState;
    this.mode = MODES.IDLE;
  }

  public isEditingMode() {
    return this.mode === MODES.EDITING;
  }

  public isDisabled() {
    return this.mode === MODES.DISABLED;
  }
}
