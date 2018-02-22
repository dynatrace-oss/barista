import { Component } from "@angular/core";
import { RadiobuttonSimpleExampleComponent } from "./examples/radiobutton-simple-example.component";

@Component({
  selector: "docs-radiobutton",
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

    .nope {
      text-decoration: line-through;
    }
  `],
  templateUrl: "./docs-radiobutton.component.html",
})
export class DocsRadiobuttonComponent {

  public examples = {
    simple: RadiobuttonSimpleExampleComponent,
  };
}
