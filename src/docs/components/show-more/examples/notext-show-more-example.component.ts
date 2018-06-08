import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: '<dt-show-more [showLess]="showLess" (changed)="showLess=!showLess"></dt-show-more>',
})
export class NoTextShowMoreExampleComponent {
  showLess = false;
}
