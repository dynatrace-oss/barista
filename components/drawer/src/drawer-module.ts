import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtIconModule } from '@dynatrace/barista-components/icon';

import { DtDrawer } from './drawer';
import { DtDrawerContainer } from './drawer-container';
import { DtSidenav, DtSidenavHeader } from './sidenav';
import { DtSidenavContainer } from './sidenav-container';

const COMPONENTS = [
  DtDrawer,
  DtDrawerContainer,
  DtSidenavContainer,
  DtSidenav,
  DtSidenavHeader,
];

@NgModule({
  imports: [CommonModule, DtIconModule],
  exports: COMPONENTS,
  declarations: COMPONENTS,
})
export class DtDrawerModule {}
