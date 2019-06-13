import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
  <dt-breadcrumbs [color]="color" aria-label="Breadcrumbs navigation">
    <dt-breadcrumbs-item href="first">First view</dt-breadcrumbs-item>
    <dt-breadcrumbs-item [href]="['first', 'second', {param: 123}]">Second view</dt-breadcrumbs-item>
    <dt-breadcrumbs-item>Current view</dt-breadcrumbs-item>
  </dt-breadcrumbs>
  <dt-button-group [value]="color" (valueChange)="changed($event)" style="margin-top: 16px">
    <dt-button-group-item value="main">main</dt-button-group-item>
    <dt-button-group-item value="error">error</dt-button-group-item>
    <dt-button-group-item value="neutral">neutral</dt-button-group-item>
  </dt-button-group>
  `,
})
export class ColorBreadcrumbsExampleComponent {
  color = 'error';

  changed(colorValue: string): void {
    this.color = colorValue;
  }
}
