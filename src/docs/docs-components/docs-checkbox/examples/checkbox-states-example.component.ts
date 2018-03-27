import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `<docs-variants-table>
  <ng-template #header>Checked</ng-template>
  <ng-template #header>..disabled</ng-template>
  <ng-template #header>Not checked</ng-template>
  <ng-template #header>..disabled</ng-template>

  <ng-template #variant>
    <dt-checkbox checked>just an example label</dt-checkbox>
  </ng-template>
  <ng-template #variant>
    <dt-checkbox checked disabled>just an example label</dt-checkbox>
  </ng-template>
  <ng-template #variant>
    <dt-checkbox>just an example label</dt-checkbox>
  </ng-template>
  <ng-template #variant>
    <dt-checkbox disabled>just an example label</dt-checkbox>
  </ng-template>
</docs-variants-table>`,
  // @formatter:on
})
export class CheckboxStatesExampleComponent {
}
