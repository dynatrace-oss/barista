import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtToggleButtonGroup } from './toggle-button-group';
import { DtToggleButtonItem } from './toggle-button-item';
import { DtToggleButtonItemIcon } from './toggle-button-item-icon';

@NgModule({
  imports: [CommonModule],
  exports: [DtToggleButtonGroup, DtToggleButtonItem, DtToggleButtonItemIcon],
  declarations: [
    DtToggleButtonGroup,
    DtToggleButtonItem,
    DtToggleButtonItemIcon,
  ],
})
export class DtToggleButtonGroupModule {}
