import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `
  <dt-switch checked [label]="htmlContent"></dt-switch>
  <br><br>
  <dt-switch checked [label]="longContent"></dt-switch>
`,
  // @formatter:on
})
export class SwitchHtmlExampleComponent {
  public static readonly htmlContent = "This is some <sup>HTML</sup> content<sub>example</sub>";
  public static readonly longContent = "This is an example of a long content. Very long content." +
      "It's so long that if you are reading this, you must be very bored. " +
    "Such a long text! But to tell the truth, this text is not long at all..." +
      "it could have been much longer if its author was less lazy.";

}
