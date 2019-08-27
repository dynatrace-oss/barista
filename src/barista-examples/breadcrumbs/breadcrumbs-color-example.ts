import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <dt-breadcrumbs [color]="color" aria-label="Breadcrumbs navigation">
      <a dtBreadcrumbsItem href="first">First view</a>
      <a dtBreadcrumbsItem href="first/second">
        Second view
      </a>
      <a dtBreadcrumbsItem>Current view</a>
    </dt-breadcrumbs>
    <dt-button-group
      [value]="color"
      (valueChange)="changed($event)"
      style="margin-top: 16px"
    >
      <dt-button-group-item value="main">main</dt-button-group-item>
      <dt-button-group-item value="error">error</dt-button-group-item>
      <dt-button-group-item value="neutral">neutral</dt-button-group-item>
    </dt-button-group>
  `,
})
export class BreadcrumbsColorExample {
  color = 'error';

  changed(colorValue: string): void {
    this.color = colorValue;
  }
}
