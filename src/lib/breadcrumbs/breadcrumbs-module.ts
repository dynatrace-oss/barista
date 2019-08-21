import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DtBreadcrumbs } from './breadcrumbs';
import { DtBreadcrumbsItem } from './item/breadcrumbs-item';

@NgModule({
  exports: [DtBreadcrumbs, DtBreadcrumbsItem],
  declarations: [DtBreadcrumbs, DtBreadcrumbsItem],
  imports: [A11yModule, CommonModule, RouterModule],
})
export class DtBreadcrumbsModule {}
