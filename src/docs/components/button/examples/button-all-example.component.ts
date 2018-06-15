import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
  <section>
    <div *ngFor="let color of colors">
      <h4>{{color.name}} Button</h4>
      <div class="variant">
        <i>Primary variant</i>
        <button dt-button [color]="color.key">Primary Button</button>
        <button disabled dt-button [color]="color.key">Disabled primary button</button>

        <a dt-button [color]="color.key">Anchor</a>
        <a disabled dt-button [color]="color.key">Disabled Anchor</a>
      </div>
      <div class="variant">
      <i>Secondary variant</i>
        <button dt-button variant="secondary" [color]="color.key">Secondary Button</button>
        <button disabled dt-button variant="secondary" [color]="color.key">Disabled secondary button</button>

        <a dt-button variant="secondary" [color]="color.key">Secondary anchor</a>
        <a disabled dt-button variant="secondary" [color]="color.key">Disabled secondary anchor</a>
      </div>
    </div>
  </section>

  <section class="dark" dtTheme=":dark">
    <div *ngFor="let color of colors">
      <h4>{{color.name}} Button</h4>
      <div class="variant">
        <i>Primary variant</i>
        <button dt-button [color]="color.key">Primary Button</button>
        <button disabled dt-button [color]="color.key">Disabled primary button</button>

        <a dt-button [color]="color.key">Anchor</a>
        <a disabled dt-button [color]="color.key">Disabled Anchor</a>
      </div>
      <div class="variant">
        <i>Secondary variant</i>
        <button dt-button variant="secondary" [color]="color.key">Secondary Button</button>
        <button disabled dt-button variant="secondary" [color]="color.key">Disabled secondary button</button>

        <a dt-button variant="secondary" [color]="color.key">Secondary anchor</a>
        <a disabled dt-button variant="secondary" [color]="color.key">Disabled secondary anchor</a>
      </div>
    </div>
  </section>
  `,
  styles: [`
    section + section {
      margin-top: 40px;
    }
    .variant + .variant {
      margin-top: 20px;
    }
    .variant i {
      display: inline-block;
      min-width: 160px;
    }
    .dt-button + .dt-button { margin-left: 12px; }
  `],
})
export class AllButtonExampleComponent {
  colors = [
    { name: 'Default', key: null },
    { name: 'Warning', key: 'warning' },
    { name: 'Call to action', key: 'cta' },
  ];
}
