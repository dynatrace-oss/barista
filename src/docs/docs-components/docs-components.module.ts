import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { ReactiveFormsModule } from "@angular/forms";
import { AngularComponentsModule } from "../../components";
import { UiModule } from "../ui/ui.module";
import { DocsButtonComponent } from "./docs-button/docs-button.component";
import { BUTTON_EXAMPLES } from "./docs-button/examples/ButtonExamples";
import { DocsCheckboxComponent } from "./docs-checkbox/docs-checkbox.component";
import { CHECKBOX_EXAMPLES } from "./docs-checkbox/examples/CheckboxExamples";
import { DocsComponentsRoutingModule } from "./docs-components-routing.module";
import { DocsRadiobuttonComponent } from "./docs-radiobutton/docs-radiobutton.component";
import { RADIOBUTTON_EXAMPLES } from "./docs-radiobutton/examples/RadiobuttonExamples";
import { DocsSwitchComponent } from "./docs-switch/docs-switch.component";
import { SWITCH_EXAMPLES } from "./docs-switch/examples/SwitchExamples";

const EXAMPLES = [
  ...BUTTON_EXAMPLES,
  ...CHECKBOX_EXAMPLES,
  ...RADIOBUTTON_EXAMPLES,
  ...SWITCH_EXAMPLES,
];

@NgModule({
  declarations: [
    DocsButtonComponent,
    DocsCheckboxComponent,
    DocsRadiobuttonComponent,
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
    ReactiveFormsModule,
  ],
})
export class DocsComponentsModule {
}