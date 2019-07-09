import { NgModule } from '@angular/core';
import { DtLoadingSpinner } from './loading-spinner';
import { DtLoadingDistractor } from './loading-distractor';

@NgModule({
  exports: [DtLoadingSpinner, DtLoadingDistractor],
  declarations: [DtLoadingSpinner, DtLoadingDistractor],
})
export class DtLoadingDistractorModule {}
