import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CheckboxComponent } from "./checkbox.component";

@NgModule({
  declarations: [
      CheckboxComponent,
  ],
  exports: [
    CheckboxComponent,
  ],
  imports: [
    CommonModule,
  ],
})
export class CheckboxModule {
}
