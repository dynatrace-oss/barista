import { Component } from "@angular/core";
import { CheckboxClickExampleComponent } from "./examples/checkbox-click-example.component";
import { CheckboxDarkExampleComponent } from "./examples/checkbox-dark-example.component";
import { CheckboxFormExampleComponent } from "./examples/checkbox-form-example.component";
import { CheckboxHtmlExampleComponent } from "./examples/checkbox-html-example.component";
import { CheckboxSimpleExampleComponent } from "./examples/checkbox-simple-example.component";
import { CheckboxStatesExampleComponent } from "./examples/checkbox-states-example.component";

@Component({
  selector: "docs-checkbox",
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

    .nope {
      text-decoration: line-through;
    }
  `],
  templateUrl: "./docs-checkbox.component.html",
})
export class DocsCheckboxComponent {

  public examples = {
    click: CheckboxClickExampleComponent,
    dark: CheckboxDarkExampleComponent,
    form: CheckboxFormExampleComponent,
    html: CheckboxHtmlExampleComponent,
    simple: CheckboxSimpleExampleComponent,
    states: CheckboxStatesExampleComponent,
  };
}
