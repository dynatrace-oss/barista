import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { AngularComponentsModule } from "../../components";
import { UiModule } from "../ui/ui.module";
import { DocsButtonComponent } from "./docs-button/docs-button.component";
import { BUTTON_EXAMPLES } from "./docs-button/examples/ButtonExamples";
import { DocsComponentsRoutingModule } from "./docs-components-routing.module";

const EXAMPLES = [
  ...BUTTON_EXAMPLES,
];

@NgModule({
  declarations: [
    DocsButtonComponent,
    ...EXAMPLES,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
  imports: [
    CommonModule,
    DocsComponentsRoutingModule,
    UiModule,
    AngularComponentsModule,
  ],
})
export class DocsComponentsModule {
}
