import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonComponent } from "./basic/button/button.component";
import { CheckboxComponent } from "./basic/checkbox/checkbox.component";
import { LoadingIndicatorComponent } from "./basic/loading-indicator.component";
import { LoadingSpinnerComponent } from "./basic/loading-spinner/loading-spinner.component";
import { RadiobuttonComponent } from "./basic/radiobutton/radiobutton.component";
import { SwitchComponent } from "./basic/switch/switch.component";

@NgModule({
  declarations: [
    LoadingIndicatorComponent,
    LoadingSpinnerComponent,
    ButtonComponent,
    CheckboxComponent,
    RadiobuttonComponent,
    SwitchComponent,
  ],
  exports: [
    LoadingIndicatorComponent,
    ButtonComponent,
    CheckboxComponent,
    RadiobuttonComponent,
    SwitchComponent,
    FormsModule,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AngularComponentsModule {
}
