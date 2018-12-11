import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
  <section class="dark" dtTheme=":dark">
    <div class="variant">
      <h4>Primary Button</h4>
      <p>
        <button dt-button>Default Button</button>
        <button dt-button color="warning">Warning Button</button>
        <button dt-button color="cta">CTA Button</button>
      </p><p>
        <button dt-button><dt-icon name="agent"></dt-icon>Default with icon</button>
        <button dt-button color="warning"><dt-icon name="agent"></dt-icon>Warning with icon</button>
        <button dt-button color="cta"><dt-icon name="agent"></dt-icon>CTA with icon</button>
      </p><p>
        <button dt-icon-button><dt-icon name="agent"></dt-icon></button>
        <button dt-icon-button color="warning"><dt-icon name="agent"></dt-icon></button>
        <button dt-icon-button color="cta"><dt-icon name="agent"></dt-icon></button>
      </p>
    </div>
    <div class="variant">
      <h4>Secondary Button</h4>
      <p>
        <button dt-button variant="secondary">Secondary Button</button>
        <button dt-button variant="secondary" color="warning">Secondary Warning Button</button>
        <button dt-button variant="secondary" color="cta">Secondary CTA Button</button>
      </p><p>
        <button dt-button variant="secondary"><dt-icon name="agent"></dt-icon>Default with icon</button>
        <button dt-button variant="secondary" color="warning"><dt-icon name="agent"></dt-icon>Warning with icon</button>
        <button dt-button variant="secondary" color="cta"><dt-icon name="agent"></dt-icon>CTA with icon</button>
      </p><p>
        <button dt-icon-button variant="secondary"><dt-icon name="agent"></dt-icon></button>
        <button dt-icon-button variant="secondary" color="warning"><dt-icon name="agent"></dt-icon></button>
        <button dt-icon-button variant="secondary" color="cta"><dt-icon name="agent"></dt-icon></button>
      </p>
    </div>
    <div class="variant">
      <h4>Nested Button</h4>
      <button dt-icon-button variant="nested"><dt-icon name="agent"></dt-icon></button>
    </div>
    <div class="variant">
      <h4>Disabled Button</h4>
      <p>
        <button dt-button disabled>Disabled Button</button>
        <button dt-button disabled variant="secondary">Disabled Secondary Button</button>
      </p><p>
        <button dt-button disabled><dt-icon name="agent"></dt-icon>Default with icon</button>
        <button dt-button disabled variant="secondary"><dt-icon name="agent"></dt-icon>Warning with icon</button>
      </p><p>
        <button dt-icon-button disabled><dt-icon name="agent"></dt-icon></button>
        <button dt-icon-button disabled variant="secondary"><dt-icon name="agent"></dt-icon></button>
        <button dt-icon-button disabled variant="nested"><dt-icon name="agent"></dt-icon></button>
      </p>
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
@OriginalClassName('DarkButtonExampleComponent')
export class DarkButtonExampleComponent { }
