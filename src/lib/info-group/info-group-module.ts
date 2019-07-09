import { NgModule } from '@angular/core';
import { DtInfoGroup, DtInfoGroupTitle, DtInfoGroupIcon } from './info-group';

@NgModule({
  exports: [DtInfoGroup, DtInfoGroupTitle, DtInfoGroupIcon],
  declarations: [DtInfoGroup, DtInfoGroupTitle, DtInfoGroupIcon],
})
export class DtInfoGroupModule {}
