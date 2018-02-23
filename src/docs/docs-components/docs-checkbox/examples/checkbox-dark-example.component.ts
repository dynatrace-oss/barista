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
    <dt-checkbox>regular, boring light background</dt-checkbox>
  </div>
  <div class="container light">
      <dt-checkbox checked disabled>...disabled</dt-checkbox>
  </div>
  <div class="theme--dark container dark">
    <dt-checkbox>some ancestor has class='theme--dark'</dt-checkbox>
  </div>
  <div class="theme--dark container dark">
      <dt-checkbox checked disabled>...disabled</dt-checkbox>
  </div>`,
  // @formatter:on
})
export class CheckboxDarkExampleComponent {
}
