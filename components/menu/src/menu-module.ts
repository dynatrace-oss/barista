import { NgModule } from '@angular/core';

import { DtMenu, DtMenuGroup, DtMenuItem } from './menu';

const MENU_DIRECTIVES = [DtMenu, DtMenuGroup, DtMenuItem];

@NgModule({
  exports: MENU_DIRECTIVES,
  declarations: MENU_DIRECTIVES,
})
export class DtMenuModule {}
