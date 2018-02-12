import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `<variants-table>
  <ng-template #header>Primary</ng-template>
  <ng-template #header>..disabled</ng-template>
  <ng-template #header>Secondary</ng-template>
  <ng-template #header>..disabled</ng-template>

  <ng-template #variant>
    <a class="btn--primary btn--call-to-action">Button</a>
  </ng-template>
  <ng-template #variant>
    <a class="btn--primary btn--call-to-action">Button</a>
  </ng-template>
  <ng-template #variant>
    <a class="btn--secondary btn--call-to-action">Button</a>
  </ng-template>
  <ng-template #variant>
    <a class="btn--secondary btn--call-to-action" disabled>Button</a>
  </ng-template>
</variants-table>`,
  // @formatter:on
})
export class ButtonCallToActionExampleComponent {
}
