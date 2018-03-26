import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `<docs-variants-table>
  <ng-template #header>Primary</ng-template>
  <ng-template #header>..disabled</ng-template>
  <ng-template #header>Secondary</ng-template>
  <ng-template #header>..disabled</ng-template>

  <ng-template #variant>
    <a dt-btn variant="warning">Button</a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn variant="warning" disabled>Button</a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn secondary variant="warning">Button</a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn secondary variant="warning" disabled>Button</a>
  </ng-template>
</docs-variants-table>`,
  // @formatter:on
})
export class ButtonWarningExampleComponent {
}
