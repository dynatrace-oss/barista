import { NgModule } from '@angular/core';

import { DtExpandablePanel } from './expandable-panel';
import { DtExpandablePanelTrigger } from './expandable-panel-trigger';

@NgModule({
  exports: [DtExpandablePanelTrigger, DtExpandablePanel],
  declarations: [DtExpandablePanelTrigger, DtExpandablePanel],
})
export class DtExpandablePanelModule {}
