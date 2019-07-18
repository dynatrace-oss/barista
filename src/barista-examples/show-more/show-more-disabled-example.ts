import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <button dt-show-more [disabled]="true">
      Show more
    </button>
  `,
})
export class ShowMoreDisabledExample {}
