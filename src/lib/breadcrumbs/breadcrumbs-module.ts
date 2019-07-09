import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DtBreadcrumbsItem } from './item/breadcrumbs-item';
import { DtBreadcrumbs } from './breadcrumbs';

@NgModule({
  exports: [DtBreadcrumbs, DtBreadcrumbsItem],
  declarations: [DtBreadcrumbs, DtBreadcrumbsItem],
  imports: [CommonModule, RouterModule],
})
export class DtBreadcrumbsModule {}
