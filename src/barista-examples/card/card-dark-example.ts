import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <div class="demo-card dark" dtTheme=":dark">
      <dt-card>
        <dt-card-icon>
          <dt-icon name="application"></dt-icon>
        </dt-card-icon>
        <dt-card-title>Top 3 JavaScript errors</dt-card-title>
        <dt-card-subtitle>Some subtitle</dt-card-subtitle>
        <dt-card-title-actions>
          <button dt-button variant="secondary">Some Action</button>
        </dt-card-title-actions>
        The card is not an interactive element, therefore there are no hover,
        active or disabled states.
      </dt-card>
    </div>
  `,
})
export class CardDarkExample {}
