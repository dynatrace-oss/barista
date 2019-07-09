import { NgModule } from '@angular/core';
import { DtToastContainer } from './toast-container';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  imports: [OverlayModule],
  declarations: [DtToastContainer],
  entryComponents: [DtToastContainer],
})
export class DtToastModule {}
