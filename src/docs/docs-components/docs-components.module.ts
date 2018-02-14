import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { AngularComponentsModule } from "../../components";
import { UiModule } from "../ui/ui.module";
import { DocsButtonComponent } from "./docs-button/docs-button.component";
import { BUTTON_EXAMPLES } from "./docs-button/examples/ButtonExamples";
import { DocsCheckboxComponent } from "./docs-checkbox/docs-checkbox.component";
import { CHECKBOX_EXAMPLES } from "./docs-checkbox/examples/CheckboxExamples";
import { DocsComponentsRoutingModule } from "./docs-components-routing.module";
import {SWITCH_EXAMPLES} from "./docs-switch/examples/SwitchExamples";
import {DocsSwitchComponent} from "./docs-switch/docs-switch.component";

const EXAMPLES = [
  ...BUTTON_EXAMPLES,
  ...CHECKBOX_EXAMPLES,
  ...SWITCH_EXAMPLES,
];

@NgModule({
  declarations: [
    DocsButtonComponent,
    DocsCheckboxComponent,
    DocsSwitchComponent,
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
