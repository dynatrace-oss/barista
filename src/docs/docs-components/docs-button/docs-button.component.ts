import { Component } from "@angular/core";
import { ButtonCallToActionExampleComponent } from "./examples/button-call-to-action-example.component";
import { ButtonClickExampleComponent } from "./examples/button-click-example.component";
import { ButtonSimpleExampleComponent } from "./examples/button-simple-example.component";
import { ButtonStatesExampleComponent } from "./examples/button-states-example.component";
import { ButtonTagExampleComponent } from "./examples/button-tag-example.component";
import { ButtonWarningExampleComponent } from "./examples/button-warning-example.component";

@Component({
  selector: "docs-button",
  styles: [`
    .section > div {
      flex-grow: 1;
    }

    .section > div + div {
      margin-left: 20px;
    }

    docs-source-example {
      display: inline-block;
    }

    .variants > div {
      margin-right: 20px;
    }
  `],
  templateUrl: "./docs-button.component.html",
})
export class DocsButtonComponent {

  public examples = {
    btnTag: ButtonTagExampleComponent,
    callToAction: ButtonCallToActionExampleComponent,
    click: ButtonClickExampleComponent,
    simple: ButtonSimpleExampleComponent,
    states: ButtonStatesExampleComponent,
    warning: ButtonWarningExampleComponent,
  };
}
