import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `<variants-table>
  <ng-template #header>Checked</ng-template>
  <ng-template #header>..disabled</ng-template>
  <ng-template #header>Unchecked</ng-template>
  <ng-template #header>..disabled</ng-template>

  <ng-template #variant>
    <dt-switch checked></dt-switch>
  </ng-template>
  <ng-template #variant>
    <dt-switch checked disabled></dt-switch>
  </ng-template>
  <ng-template #variant>
    <dt-switch></dt-switch>
  </ng-template>
  <ng-template #variant>
    <dt-switch disabled></dt-switch>
  </ng-template>
</variants-table>
`,
  // @formatter:on
})
export class SwitchStatesExampleComponent {
}
