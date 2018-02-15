import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `<variants-table>
  <ng-template #header>ON</ng-template>
  <ng-template #header>..disabled</ng-template>
  <ng-template #header>OFF</ng-template>
  <ng-template #header>..disabled</ng-template>

  <ng-template #variant>
    <dt-switch checked [label]="example"></dt-switch>
  </ng-template>
  <ng-template #variant>
    <dt-switch checked disabled [label]="example"></dt-switch>
  </ng-template>
  <ng-template #variant>
    <dt-switch [label]="example"></dt-switch>
  </ng-template>
  <ng-template #variant>
    <dt-switch disabled [label]="example"></dt-switch>
  </ng-template>
</variants-table>
`,
  // @formatter:on
})
export class SwitchStatesExampleComponent {
  public example = "just an example label";
}
