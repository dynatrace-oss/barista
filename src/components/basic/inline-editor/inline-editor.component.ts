import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output
} from "@angular/core";
import { CanBeDisabled, mixinDisabled } from "../../core/mixins/disabled.mixin";
import { MixinComposer } from "../../core/mixins/MixinComposer";

export const _InlineEditorComponentBase = MixinComposer.fromScratch()
    .with(mixinDisabled)
    .build();

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
    {{ text }}
    <input [(ngModel)]="text" *ngIf="isEditingMode()" />
    <button type="button" *ngIf="!isEditingMode() !isDisabled()" (click)="enterEditingMode()">edit</button>
    <button type="button" *ngIf="isEditingMode()" (click)="saveAndQuitEditing()">save</button>
    <button type="button" *ngIf="isEditingMode()" (click)="cancelAndQuitEditing()">cancel</button>
  `,
})
export class InlineEditorComponent extends _InlineEditorComponentBase implements CanBeDisabled {

  private mode = MODES.IDLE;

  @Input('dt-inline-editor') text: string = '';
  @Output('dt-inline-editorChange') textChange = new EventEmitter();

  @HostBinding("attr.disabled")
  private get disabledBinding(): true | undefined {
    return this.disabled ? this.disabled : undefined;
  }

  public enterEditingMode() {
    this.mode = MODES.EDITING;
  }

  public saveAndQuitEditing() {
    this.mode = MODES.IDLE;
    this.textChange.emit(this.text);
  }

  public cancelAndQuitEditing() {
    this.mode = MODES.IDLE;
    // TODO: reset text to initial state
  }

  public isEditingMode() {
    return this.mode === MODES.EDITING;
  }

  public isDisabled() {
    return this.mode === MODES.DISABLED;
  }
}
