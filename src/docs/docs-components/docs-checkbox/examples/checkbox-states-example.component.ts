import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `<variants-table>
  <ng-template #header>Checked</ng-template>
  <ng-template #header>..disabled</ng-template>
  <ng-template #header>Not checked</ng-template>
  <ng-template #header>..disabled</ng-template>

  <ng-template #variant>
    <dt-checkbox checked [label]="example"></dt-checkbox>
  </ng-template>
  <ng-template #variant>
    <dt-checkbox checked disabled [label]="example"></dt-checkbox>
  </ng-template>
  <ng-template #variant>
    <dt-checkbox [label]="example"></dt-checkbox>
  </ng-template>
  <ng-template #variant>
    <dt-checkbox disabled [label]="example"></dt-checkbox>
  </ng-template>
</variants-table>
`,
  // @formatter:on
})
export class CheckboxStatesExampleComponent {
  public example = "just an example label";
}
