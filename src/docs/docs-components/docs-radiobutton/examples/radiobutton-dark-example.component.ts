import { Component } from "@angular/core";

@Component({
  // @formatter:off
  styles: [`
    .container {
      padding: 16px;
      max-width: 400px;
    }
    .light {
      background-color: #ececec;
    }
    .dark {
      background-color: #434343;
    }
  `],
  template: `<div class="container light">
    <dt-radio name="light" checked></dt-radio>
    <dt-radio name="light">regular, boring light background</dt-radio>
  </div>
  <div class="container light">
    <dt-radio name="disabled_light" checked disabled></dt-radio>
    <dt-radio name="disabled_light" disabled>... disabled</dt-radio>
  </div>
  <div class="theme--dark container dark">
    <dt-radio name="dark" checked></dt-radio>
    <dt-radio name="dark">some ancestor has class='theme--dark'</dt-radio>
  </div>
  <div class="theme--dark container dark">
      <dt-radio name="disabled_dark" checked disabled></dt-radio>
      <dt-radio name="disabled_dark" disabled>... disabled</dt-radio>
  </div>`,
  // @formatter:on
})
export class RadiobuttonDarkExampleComponent {
}
