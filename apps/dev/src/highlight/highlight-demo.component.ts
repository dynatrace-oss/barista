import { Component } from '@angular/core';

@Component({
  selector: 'demo-component',
  styleUrls: ['highlight-demo.component.scss'],
  templateUrl: 'highlight-demo.component.html',
})
export class HighlightDemo {
  caseSensitive = false;

  name = 'John';

  items = Array(2000).fill(1);

  searchTerm = '';

  constructor() {
    setTimeout(() => {
      this.name = 'Jane';
    }, 2000);
  }
}
