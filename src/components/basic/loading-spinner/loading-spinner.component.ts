import { Component } from "@angular/core";

@Component({
  selector: "dt-loading-spinner",
  styleUrls: ["./loading-spinner.component.scss"],
  template: `
    <div class="side">
      <div class="bar"></div>
    </div>
    <div class="side">
      <div class="bar"></div>
    </div>
  `,
})
export class LoadingSpinnerComponent {
}
