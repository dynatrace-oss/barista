import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: '<em dt-inline-editor [(ngModel)]="sampleModel"></em>',
})
export class PureInlineEditorExample {
  sampleModel = 'test';
}
