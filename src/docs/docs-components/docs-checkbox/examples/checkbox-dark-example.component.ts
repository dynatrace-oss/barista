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
  template: `
  <div class="container light">
    <dt-checkbox checked disabled></dt-checkbox>
    <dt-checkbox [label]="lightSide"></dt-checkbox>
  </div>
  <div class="theme--dark container dark">
    <dt-checkbox checked disabled></dt-checkbox>
    <dt-checkbox [label]="darkSide"></dt-checkbox>
  </div>
`,
  // @formatter:on
})
export class CheckboxDarkExampleComponent {
  public lightSide = "regular, boring light background";
  public darkSide = "some ancestor has class='theme--dark'";
}
