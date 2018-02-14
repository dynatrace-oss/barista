import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonComponent } from "./basic/button/button.component";
import { CheckboxComponent } from "./basic/checkbox/checkbox.component";
import { LoadingIndicatorComponent } from "./basic/loading-indicator.component";
import { LoadingSpinnerComponent } from "./basic/loading-spinner/loading-spinner.component";
import { SwitchComponent } from "./basic/switch/switch.component";

@NgModule({
  declarations: [
    LoadingIndicatorComponent,
    LoadingSpinnerComponent,
    ButtonComponent,
    CheckboxComponent,
    SwitchComponent,
  ],
  exports: [
    LoadingIndicatorComponent,
    ButtonComponent,
    CheckboxComponent,
    SwitchComponent,
    FormsModule,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
})
export class AngularComponentsModule {
}
