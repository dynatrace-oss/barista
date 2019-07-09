import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-progress-bar [value]="75">
      <dt-progress-bar-description>
        We found more than 100 results. This may take a while, consider
        narrowing your search.
      </dt-progress-bar-description>
    </dt-progress-bar>
  `,
})
export class ProgressBarWithDescriptionExample {}
