import { NgModule } from '@angular/core';

import { DtProgressBar } from './progress-bar';
import { DtProgressBarCount } from './progress-bar-count';
import { DtProgressBarDescription } from './progress-bar-description';

@NgModule({
  exports: [DtProgressBar, DtProgressBarDescription, DtProgressBarCount],
  declarations: [DtProgressBar, DtProgressBarDescription, DtProgressBarCount],
})
export class DtProgressBarModule {}
