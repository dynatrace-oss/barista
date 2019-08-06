import { NgModule } from '@angular/core';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import {
  DtEmptyState,
  DtEmptyStateFooterActions,
  DtEmptyStateItem,
  DtEmptyStateItemImage,
  DtEmptyStateItemTitle,
} from './empty-state';

const EMPTY_STATE_DIRECTIVES = [
  DtEmptyState,
  DtEmptyStateItem,
  DtEmptyStateItemImage,
  DtEmptyStateItemTitle,
  DtEmptyStateFooterActions,
];

@NgModule({
  exports: [EMPTY_STATE_DIRECTIVES],
  declarations: [EMPTY_STATE_DIRECTIVES],
  imports: [DtIconModule],
})
export class DtEmptyStateModule {}
