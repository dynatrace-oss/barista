import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  styleUrls: ['highlight-demo.component.scss'],
  templateUrl: 'highlight-demo.component.html',
})
export class HighlightDemo {
  caseSensitive = false;

  name = 'John';

  constructor() {
    setTimeout(() => { this.name = 'Jane'; }, 2000);
  }
}
