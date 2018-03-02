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
    <dt-switch checked disabled></dt-switch>
    <dt-switch></dt-switch>
  </div>
  <div class="theme--dark container dark">
    <dt-switch checked disabled>regular, boring light background</dt-switch>
    <dt-switch>some ancestor has class='theme--dark'</dt-switch>
  </div>`,
  // @formatter:on
})
export class SwitchDarkExampleComponent {
}
