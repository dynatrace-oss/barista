import { NgModule } from '@angular/core';
import { DtProgressBar } from './progress-bar';
import { DtProgressBarDescription } from './progress-bar-description';
import { DtProgressBarCount } from './progress-bar-count';

@NgModule({
  exports: [DtProgressBar, DtProgressBarDescription, DtProgressBarCount],
  declarations: [DtProgressBar, DtProgressBarDescription, DtProgressBarCount],
})
export class DtProgressBarModule {}
