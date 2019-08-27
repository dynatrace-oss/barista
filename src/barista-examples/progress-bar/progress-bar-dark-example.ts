import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <div class="dark" dtTheme=":dark">
      <dt-progress-bar [value]="value">
        <dt-progress-bar-description>
          We found more than 100 results. This may take a while, consider
          narrowing your search.
        </dt-progress-bar-description>
        <dt-progress-bar-count>{{ value }}% loaded</dt-progress-bar-count>
      </dt-progress-bar>
    </div>
  `,
})
export class ProgressBarDarkExample {
  value = 67;
}
