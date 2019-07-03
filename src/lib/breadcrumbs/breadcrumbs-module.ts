import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DtBreadcrumbsItem } from './item/breadcrumbs-item';
import { DtBreadcrumbs } from './breadcrumbs';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
  exports: [
    DtBreadcrumbs,
    DtBreadcrumbsItem,
  ],
  declarations: [
    DtBreadcrumbs,
    DtBreadcrumbsItem,
  ],
  imports: [
    A11yModule,
    CommonModule,
    RouterModule,
  ],
})
export class DtBreadcrumbsModule {}
