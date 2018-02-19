import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `<variants-table>
  <ng-template #header>Primary</ng-template>
  <ng-template #header>..disabled</ng-template>
  <ng-template #header>Secondary</ng-template>
  <ng-template #header>..disabled</ng-template>
  <ng-template #header>Primary w/ icon</ng-template>
  <ng-template #header></ng-template>
  <ng-template #header>..disabled</ng-template>
  <ng-template #header></ng-template>
  <ng-template #header>Secondary w/ icon</ng-template>
  <ng-template #header></ng-template>
  <ng-template #header>..disabled</ng-template>
  <ng-template #header></ng-template>

  <ng-template #variant>
    <a dt-btn class="primary">Button</a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn class="primary" disabled>Button</a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn secondary class="">Button</a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn secondary class="" disabled>Button</a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn class="primary fonticon-Plugin">Button</a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn class="primary fonticon-Plugin"></a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn class="primary fonticon-Plugin" disabled>Button</a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn class="primary fonticon-Plugin" disabled></a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn secondary class=" fonticon-Plugin">Button</a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn secondary class=" fonticon-Plugin"></a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn secondary class=" fonticon-Plugin" disabled>Button</a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn secondary class=" fonticon-Plugin" disabled></a>
  </ng-template>
</variants-table>`,
  // @formatter:on
})
export class ButtonStatesExampleComponent {
}
