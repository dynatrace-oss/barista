import { NgModule } from '@angular/core';

import {
  DtTopBarAction,
  DtTopBarNavigation,
  DtTopBarNavigationItem,
} from './top-bar-navigation';

@NgModule({
  imports: [],
  exports: [DtTopBarAction, DtTopBarNavigation, DtTopBarNavigationItem],
  declarations: [DtTopBarAction, DtTopBarNavigation, DtTopBarNavigationItem],
})
export class DtTopBarNavigationModule {}
