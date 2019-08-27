import { Component } from '@angular/core';
import { Observable } from 'rxjs';

const TIMEOUT_MS = 2000;

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <em
      dt-inline-editor
      [(ngModel)]="sampleModel"
      [onRemoteSave]="failingSaveFunction"
      aria-label-save="Save text"
      aria-label-cancel="Cancel and discard changes"
    ></em>
  `,
})
export class InlineEditorFailingExample {
  sampleModel = 'text content';

  failingSaveFunction(): Observable<void> {
    return new Observable<void>(observer => {
      setTimeout(() => {
        observer.error();
      }, TIMEOUT_MS);
    });
  }
}
