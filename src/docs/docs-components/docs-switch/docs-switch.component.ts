import { Component } from "@angular/core";
import { SwitchClickExampleComponent } from "./examples/switch-click-example.component";
import { SwitchDarkExampleComponent } from "./examples/switch-dark-example.component";
import { SwitchFormExampleComponent } from "./examples/switch-form-example.component";
import { SwitchHtmlExampleComponent } from "./examples/switch-html-example.component";
import { SwitchSidesExampleComponent } from "./examples/switch-sides-example.component";
import { SwitchSimpleExampleComponent } from "./examples/switch-simple-example.component";
import { SwitchStatesExampleComponent } from "./examples/switch-states-example.component";

@Component({
  selector: "docs-switch",
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
  templateUrl: "./docs-switch.component.html",
})
export class DocsSwitchComponent {

  public examples = {
    click: SwitchClickExampleComponent,
    dark: SwitchDarkExampleComponent,
    form: SwitchFormExampleComponent,
    html: SwitchHtmlExampleComponent,
    sides: SwitchSidesExampleComponent,
    simple: SwitchSimpleExampleComponent,
    states: SwitchStatesExampleComponent,
  };
}
