import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `<variants-table>
  <ng-template #header>Primary</ng-template>
  <ng-template #header>..disabled</ng-template>
  <ng-template #header>Secondary</ng-template>
  <ng-template #header>..disabled</ng-template>

  <ng-template #variant>
    <a class="btn--primary btn--warning">Button</a>
  </ng-template>
  <ng-template #variant>
    <a class="btn--primary btn--warning" disabled>Button</a>
  </ng-template>
  <ng-template #variant>
    <a class="btn--secondary btn--warning">Button</a>
  </ng-template>
  <ng-template #variant>
    <a class="btn--secondary btn--warning" disabled>Button</a>
  </ng-template>
</variants-table>`,
  // @formatter:on
})
export class ButtonWarningExampleComponent {
}
