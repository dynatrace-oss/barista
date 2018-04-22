import { Component, ViewChild } from '@angular/core';
import { DtInlineEditor } from '@dynatrace/angular-components';
import { Observable } from 'rxjs/Observable';
// tslint:disable-next-line:no-import-side-effect
import 'rxjs/add/operator/delay';
const TIMEOUT_MS = 2000;

@Component({
  moduleId: module.id,
  template: `
    <em dt-inline-editor
      [(ngModel)]="sampleModel"
      [onSave]="failingSaveFunction"></em>
  `,
})
export class FailingInlineEditorExample {
  sampleModel = 'text content';

  failingSaveFunction(): Observable<void> {
    return new Observable<void>((observer) => {
      setTimeout(
        () => {
          observer.error();
        },
        TIMEOUT_MS);
    });
  }
}
