import { Component, ViewChild } from '@angular/core';
import { DtInlineEditor } from '@dynatrace/angular-components';
import { Observable } from "rxjs/Observable"
import 'rxjs/add/operator/delay';

@Component({
  moduleId: module.id,
  template: `
    <em dt-inline-editor
      [(ngModel)]="sampleModel"
      [onSave]="successfulSaveFunction"></em>
  `,
})
export class SuccessfulInlineEditorExample {
  private sampleModel = 'text content';

  private successfulSaveFunction () {
    return new Observable<void>((observer) => {
      setTimeout(() => {
        observer.next();
        observer.complete();
      }, 2e3);
    });
  }
}
