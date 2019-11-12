import { NgModule } from '@angular/core';

import { DtLoadingDistractor } from './loading-distractor';
import { DtLoadingSpinner } from './loading-spinner';

@NgModule({
  exports: [DtLoadingSpinner, DtLoadingDistractor],
  declarations: [DtLoadingSpinner, DtLoadingDistractor],
})
export class DtLoadingDistractorModule {}
