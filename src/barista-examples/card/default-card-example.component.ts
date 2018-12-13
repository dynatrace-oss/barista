import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `<div class="demo-card">
<dt-card>
  <dt-card-title>Top 3 JavaScript errors</dt-card-title>
  <dt-card-subtitle>Some subtitle</dt-card-subtitle>
  <dt-card-actions><button dt-button variant="secondary">Some Action</button></dt-card-actions>
  The card is not an interactive element, therefore, there are no hover, active and disabled card.
</dt-card></div>`,
})
@OriginalClassName('DefaultCardExampleComponent')
export class DefaultCardExampleComponent { }
