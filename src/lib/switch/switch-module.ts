import { NgModule } from '@angular/core';
import { DtSwitch, DtSwitchRequiredValidator } from './switch';

@NgModule({
  exports: [
    DtSwitch,
    DtSwitchRequiredValidator,
  ],
  declarations: [
    DtSwitch,
    DtSwitchRequiredValidator,
  ],
})
export class DtSwitchModule { }
