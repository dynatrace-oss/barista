import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <dt-show-more [disabled]="true">
      Show more
    </dt-show-more>
  `,
})
export class ShowMoreDisabledExample {}
