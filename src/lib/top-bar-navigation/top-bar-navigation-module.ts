import { NgModule } from '@angular/core';

import {
  DtTopBarAction,
  DtTopBarNavigation,
  DtTopBarNavigationItem,
} from './top-bar-navigation';

const DT_TOP_BAR_DIRECTIVES = [
  DtTopBarAction,
  DtTopBarNavigation,
  DtTopBarNavigationItem,
];

@NgModule({
  imports: [],
  exports: DT_TOP_BAR_DIRECTIVES,
  declarations: DT_TOP_BAR_DIRECTIVES,
})
export class DtTopBarNavigationModule {}
