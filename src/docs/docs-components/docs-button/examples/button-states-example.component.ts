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
    <a dt-btn >Button</a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn  disabled>Button</a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn secondary>Button</a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn secondary disabled>Button</a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn class="fonticon-Plugin">Button</a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn class="fonticon-Plugin"></a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn disabled class="fonticon-Plugin">Button</a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn disabled class="fonticon-Plugin"></a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn secondary class="fonticon-Plugin">Button</a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn secondary class="fonticon-Plugin"></a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn secondary disabled class="fonticon-Plugin">Button</a>
  </ng-template>
  <ng-template #variant>
    <a dt-btn secondary disabled class="fonticon-Plugin"></a>
  </ng-template>
</variants-table>`,
  // @formatter:on
})
export class ButtonStatesExampleComponent {
}
