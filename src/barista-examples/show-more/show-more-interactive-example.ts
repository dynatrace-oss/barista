import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-show-more [showLess]="showLess" (changed)="showLess = !showLess">
      Show more
      <dt-show-less-label>Show less</dt-show-less-label>
    </dt-show-more>
    <button
      dt-button
      (click)="showLess = !showLess"
      [variant]="showLess ? 'primary' : 'secondary'"
    >
      Toggle more
    </button>
  `,
})
export class ShowMoreInteractiveExample {
  showLess = false;
}
