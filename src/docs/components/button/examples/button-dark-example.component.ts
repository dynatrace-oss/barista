import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
  <section class="dark" dtTheme=":dark">
    <div class="variant">
      <h4>Primary Button</h4>
      <button dt-button>Default Button</button>
      <button dt-button color="warning">Warning Button</button>
      <button dt-button color="cta">CTA Button</button>
    </div>
    <div class="variant">
      <h4>Secondary Button</h4>
      <button dt-button variant="secondary">Secondary Button</button>
      <button dt-button variant="secondary" color="warning">Secondary Warning Button</button>
      <button dt-button variant="secondary" color="cta">Secondary CTA Button</button>
    </div>
    <div class="variant">
      <h4>Disabled Button</h4>
      <button dt-button disabled>Disabled Button</button>
      <button dt-button disabled variant="secondary">Disabled Secondary Button</button>
    </div>
  </section>
  `,
  styles: [`
    .variant + .variant {
      margin-top: 20px;
    }
    .dt-button + .dt-button { margin-left: 8px; }
  `],
})
export class DarkButtonExampleComponent { }
