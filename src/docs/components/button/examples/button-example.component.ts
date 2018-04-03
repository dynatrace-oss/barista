import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
  <div class="demo-button">
    <h1>Button</h1>
    <section>
      <div *ngFor="let color of colors">
        <h2>{{color.name}} Button</h2>
        <h3>Primary</h3>
        <button dt-button [color]="color.key">Primary Button</button>
        <button disabled dt-button [color]="color.key">Disabled primary button</button>

        <a dt-button [color]="color.key">Anchor</a>
        <a disabled dt-button [color]="color.key">Disabled Anchor</a>

        <h3>Secondary Buttons</h3>
        <button dt-button variant="secondary" [color]="color.key">Secondary Button</button>
        <button disabled dt-button variant="secondary" [color]="color.key">Disabled secondary button</button>

        <a dt-button variant="secondary" [color]="color.key">Secondary anchor</a>
        <a disabled dt-button variant="secondary" [color]="color.key">Disabled secondary anchor</a>
      </div>
    </section>

    <section class="dark" ghTheme=":dark">
      <div *ngFor="let color of colors">
        <h2>{{color.name}} Button</h2>
        <h3>Primary</h3>
        <button dt-button [color]="color.key">Primary Button</button>
        <button disabled dt-button [color]="color.key">Disabled primary button</button>

        <a dt-button [color]="color.key">Anchor</a>
        <a disabled dt-button [color]="color.key">Disabled Anchor</a>

        <h3>Secondary Buttons</h3>
        <button dt-button variant="secondary" [color]="color.key">Secondary Button</button>
        <button disabled dt-button variant="secondary" [color]="color.key">Disabled secondary button</button>

        <a dt-button variant="secondary" [color]="color.key">Secondary anchor</a>
        <a disabled dt-button variant="secondary" [color]="color.key">Disabled secondary anchor</a>
      </div>
    </section>
  </div>
  `,
})
export class ButtonExampleComponent {
  colors = [
    { name: 'Default', key: null },
    { name: 'Warning', key: 'warning' },
    { name: 'Call to action', key: 'cta' },
  ];
}
