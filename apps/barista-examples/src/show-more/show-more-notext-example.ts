import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template:
    '<dt-show-more [showLess]="showLess" (changed)="showLess=!showLess" aria-label="Show more data"></dt-show-more>',
})
export class ShowMoreNoTextExample {
  showLess = false;
}
