import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SwitchComponent } from "./switch.component";

@NgModule({
  declarations: [
    SwitchComponent,
  ],
  exports: [
    SwitchComponent,
  ],
  imports: [
    CommonModule,
  ],
})
export class SwitchModule {
}
