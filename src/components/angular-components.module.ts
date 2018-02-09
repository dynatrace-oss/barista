import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonComponent } from "./basic/button/button.component";
import { LoadingIndicatorComponent } from "./basic/loading-indicator.component";
import { LoadingSpinnerComponent } from "./basic/loading-spinner/loading-spinner.component";

@NgModule({
  declarations: [
    LoadingIndicatorComponent,
    LoadingSpinnerComponent,
    ButtonComponent,
  ],
  exports: [
    LoadingIndicatorComponent,
    ButtonComponent,
    FormsModule,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
})
export class AngularComponentsModule {
}
