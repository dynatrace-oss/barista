import { NgModule } from '@angular/core';
import { DtExpandablePanelTrigger } from './expandable-panel-trigger';
import { DtExpandablePanel } from './expandable-panel';

@NgModule({
  exports: [DtExpandablePanelTrigger, DtExpandablePanel],
  declarations: [DtExpandablePanelTrigger, DtExpandablePanel],
})
export class DtExpandablePanelModule {}
