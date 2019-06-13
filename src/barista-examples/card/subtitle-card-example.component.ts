import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
<div class="demo-card">
  <dt-card>
    <dt-card-title>Top 3 JavaScript errors</dt-card-title>
    <dt-card-subtitle>Some subtitle</dt-card-subtitle>
    This is some generic content
  </dt-card>
</div>`,
})
export class SubtitleCardExampleComponent { }
