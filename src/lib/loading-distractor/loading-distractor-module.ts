import { NgModule } from '@angular/core';
import { DtLoadingSpinner, DtLoadingDistractor } from './loading-distractor';

@NgModule({
  exports: [
    DtLoadingSpinner,
    DtLoadingDistractor,
  ],
  declarations: [
    DtLoadingSpinner,
    DtLoadingDistractor,
  ],
})
export class DtLoadingDistractorModule { }
