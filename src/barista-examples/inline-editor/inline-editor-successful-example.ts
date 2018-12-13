import { Component } from '@angular/core';
import { Observable } from 'rxjs';

const TIMEOUT_MS = 2000;

@Component({
  moduleId: module.id,
  template: `
    <em dt-inline-editor
      [(ngModel)]="sampleModel"
      [onRemoteSave]="successfulSaveFunction"></em>
  `,
})
@OriginalClassName('SuccessfulInlineEditorExample')
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
