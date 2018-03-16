import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RadiobuttonComponent } from "./radiobutton.component";

@NgModule({
  declarations: [
    RadiobuttonComponent,
  ],
  exports: [
      RadiobuttonComponent,
  ],
  imports: [
    CommonModule,
  ],
})
export class RadiobuttonModule {
}
