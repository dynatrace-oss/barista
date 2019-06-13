import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: '<dt-show-more [showLess]="showLess" (changed)="showLess=!showLess" aria-label="Show more data"></dt-show-more>',
})
export class NoTextShowMoreExampleComponent {
  showLess = false;
}
