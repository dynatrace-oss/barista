import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtDrawer } from './drawer';
import { DtDrawerContainer } from './drawer-container';

@NgModule({
  imports: [CommonModule],
  exports: [DtDrawer, DtDrawerContainer],
  declarations: [DtDrawer, DtDrawerContainer],
})
export class DtDrawerModule {}
