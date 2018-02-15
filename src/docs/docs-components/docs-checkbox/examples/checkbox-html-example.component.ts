import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `
  <dt-checkbox checked [label]="htmlContent"></dt-checkbox>
  <br><br>
  <dt-checkbox checked [label]="longContent"></dt-checkbox>
`,
  // @formatter:on
})
export class CheckboxHtmlExampleComponent {
  public htmlContent = "This is some <sup>HTML</sup> content<sub>example</sub>";
  public longContent = "This is an example of a long content. Very long content." +
      "It's so long that if you are reading this, you must be very bored. " +
    "Such a long text! But to tell the truth, this text is not long at all..." +
      "it could have been much longer if its author was less lazy.";

}
