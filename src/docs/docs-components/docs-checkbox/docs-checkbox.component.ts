import { Component } from "@angular/core";
import { CheckboxSimpleExampleComponent } from "./examples/checkbox-simple-example.component";
import { CheckboxClickExampleComponent } from "./examples/checkbox-click-example.component";

@Component({
  selector: "docs-checkbox",
  styles: [`
    .section > div {
      flex-grow: 1;
    }

    .section > div + div {
      margin-left: 20px;
    }

    source-example {
      display: inline-block;
    }

    .variants > div {
      margin-right: 20px;
    }
  `],
  templateUrl: "./docs-checkbox.component.html",
})
export class DocsCheckboxComponent {

  public examples = {
    simple: CheckboxSimpleExampleComponent,
    click: CheckboxClickExampleComponent,
  };
}
