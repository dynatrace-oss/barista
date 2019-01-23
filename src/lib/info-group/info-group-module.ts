import {NgModule} from '@angular/core';
import {DtInfoGroup} from './info-group';
import {
  DtInfoGroupTitle,
  DtInfoGroupIcon,
} from './info-group';

@NgModule({
  exports: [
    DtInfoGroup,
    DtInfoGroupTitle,
    DtInfoGroupIcon,
  ],
  declarations: [
    DtInfoGroup,
    DtInfoGroupTitle,
    DtInfoGroupIcon,
  ],
})
export class DtInfoGroupModule {}
