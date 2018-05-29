import {NgModule} from '@angular/core';
import {DtShowMore} from './show-more';
import { DtIconModule } from '../icon/icon-module';

@NgModule({
  imports: [
    DtIconModule,
  ],
  exports: [
    DtShowMore,
    DtIconModule,
  ],
  declarations: [
    DtShowMore,
  ],
})
export class DtShowMoreModule {}
