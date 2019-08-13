import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DtBreadcrumbs } from './breadcrumbs';
import { DtBreadcrumbsItem2 } from './breadcrumbs-item';
import { DtBreadcrumbsItem } from './item/breadcrumbs-item';

@NgModule({
  exports: [
    DtBreadcrumbs,
    DtBreadcrumbsItem, // tslint:disable-line:deprecation
    DtBreadcrumbsItem2,
  ],
  declarations: [
    DtBreadcrumbs,
    DtBreadcrumbsItem, // tslint:disable-line:deprecation
    DtBreadcrumbsItem2,
  ],
  imports: [A11yModule, CommonModule, RouterModule],
})
export class DtBreadcrumbsModule {}
