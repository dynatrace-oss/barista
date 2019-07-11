import { Component } from '@angular/core';
import { Observable } from 'rxjs';

const TIMEOUT_MS = 2000;

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <em
      dt-inline-editor
      [(ngModel)]="sampleModel"
      [onRemoteSave]="successfulSaveFunction"
      aria-label-save="Save text"
      aria-label-cancel="Cancel and discard changes"
    ></em>
  `,
})
export class InlineEditorSuccessfulExample {
  sampleModel = 'text content';

  successfulSaveFunction(): Observable<void> {
    return new Observable<void>(observer => {
      setTimeout(() => {
        observer.next();
        observer.complete();
      }, TIMEOUT_MS);
    });
  }
}
