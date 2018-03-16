import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "./basic/button/button.module";
import { CheckboxComponent } from "./basic/checkbox/checkbox.component";
import { LoadingIndicatorComponent } from "./basic/loading-indicator.component";
import { LoadingSpinnerComponent } from "./basic/loading-spinner/loading-spinner.component";
import { RadiobuttonComponent } from "./basic/radiobutton/radiobutton.component";
import { SwitchComponent } from "./basic/switch/switch.component";

@NgModule({
  declarations: [
    LoadingIndicatorComponent,
    LoadingSpinnerComponent,
    CheckboxComponent,
    RadiobuttonComponent,
    SwitchComponent,
  ],
  exports: [
    LoadingIndicatorComponent,
    ButtonModule,
    CheckboxComponent,
    RadiobuttonComponent,
    SwitchComponent,
    FormsModule,
  ],
  imports: [
    ButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AngularComponentsModule {
}
