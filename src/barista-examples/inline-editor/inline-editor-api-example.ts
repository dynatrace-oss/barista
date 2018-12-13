import { Component, ViewChild } from '@angular/core';
import { DtInlineEditor } from '@dynatrace/angular-components';

@Component({
  moduleId: module.id,
  template: `
    <em #sampleEditor
      dt-inline-editor
      [(ngModel)]="sampleModel"></em>

    <button (click)="sampleEditor.enterEditing()">open editor</button>
    <button (click)="sampleEditor.saveAndQuitEditing()">save changes</button>
    <button (click)="sampleEditor.cancelAndQuitEditing()">cancel changes</button>
  `,
})
@OriginalClassName('ApiInlineEditorExample')
export class ApiInlineEditorExample {
  @ViewChild('sampleEditor') sampleEditor: DtInlineEditor;
  sampleModel = 'text content';
}
