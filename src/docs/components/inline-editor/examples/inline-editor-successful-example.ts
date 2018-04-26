import { Component, ViewChild } from '@angular/core';
import { DtInlineEditor } from '@dynatrace/angular-components';
import { Observable } from "rxjs/Observable"
import 'rxjs/add/operator/delay';

const TIMEOUT_MS = 2000;

@Component({
  moduleId: module.id,
  template: `
    <em dt-inline-editor
      [(ngModel)]="sampleModel"
      [onSave]="successfulSaveFunction"></em>
  `,
})
export class SuccessfulInlineEditorExample {
  sampleModel = 'text content';

  successfulSaveFunction(): Observable<void> {
    return new Observable<void>((observer) => {
      setTimeout(
        () => {
          observer.next();
          observer.complete();
        },
        TIMEOUT_MS);
    });
  }
}
