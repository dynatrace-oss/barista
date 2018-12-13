import { Component } from '@angular/core';
import { Observable } from 'rxjs';

const TIMEOUT_MS = 2000;

@Component({
  moduleId: module.id,
  template: `
    <em dt-inline-editor
      [(ngModel)]="sampleModel"
      [onRemoteSave]="failingSaveFunction"></em>
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
