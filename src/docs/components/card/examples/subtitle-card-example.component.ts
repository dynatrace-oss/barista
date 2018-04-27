import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  styles: ['.demo-card { background-color: #f2f2f2; padding: 1rem; }'],
  template: `<div class="demo-card">
<dt-card>
  <dt-card-title>Top 3 JavaScript errors</dt-card-title>
  <dt-card-subtitle>Some subtitle</dt-card-subtitle>
  This is some generic content
</dt-card></div>`,
})
export class SubtitleCardExampleComponent { }
