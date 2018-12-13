import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `<div class="demo-card">
<dt-card>
  <dt-card-title>Top 3 JavaScript errors</dt-card-title>
  <dt-card-subtitle>Some subtitle</dt-card-subtitle>
  <dt-card-title-actions>
    <button dt-button variant="secondary">Add to dashboard</button>
    <button dt-button variant="secondary">Edit</button>
  </dt-card-title-actions>
  The card is not an interactive element, therefore, there are no hover, active and disabled card.
</dt-card></div>`,
  styles: ['.dt-button + .dt-button { margin-left: 8px;}; }'],
})
export class ActionButtonsCardExampleComponent { }
