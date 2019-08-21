import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';

import { DtToastContainer } from './toast-container';

@NgModule({
  imports: [OverlayModule],
  declarations: [DtToastContainer],
  entryComponents: [DtToastContainer],
})
export class DtToastModule {}
