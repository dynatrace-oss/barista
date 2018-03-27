import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `<docs-variants-table>
  <ng-template #header>ON</ng-template>
  <ng-template #header>..disabled</ng-template>
  <ng-template #header>OFF</ng-template>
  <ng-template #header>..disabled</ng-template>

  <ng-template #variant>
    <dt-switch checked>just an example label</dt-switch>
  </ng-template>
  <ng-template #variant>
    <dt-switch checked disabled>just an example label</dt-switch>
  </ng-template>
  <ng-template #variant>
    <dt-switch>just an example label</dt-switch>
  </ng-template>
  <ng-template #variant>
    <dt-switch disabled>just an example label</dt-switch>
  </ng-template>
</docs-variants-table>`,
  // @formatter:on
})
export class SwitchStatesExampleComponent {
}
