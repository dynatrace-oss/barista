import { Component, ViewChild } from '@angular/core';
import { DtInlineEditor } from '@dynatrace/angular-components';
import { Observable } from "rxjs/Observable"
import 'rxjs/add/operator/delay';

@Component({
  moduleId: module.id,
  template: `
    <em dt-inline-editor
      [(ngModel)]="sampleModel"
      [onSave]="failingSaveFunction"></em>
  `,
})
export class FailingInlineEditorExample {
  private sampleModel = 'text content';

  private failingSaveFunction () {
    return new Observable<void>((observer) => {
      setTimeout(() => {
        observer.error();
      }, 2e3);
    });
  }
}
