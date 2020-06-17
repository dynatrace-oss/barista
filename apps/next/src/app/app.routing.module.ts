import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NextErrorPage } from './pages/error-page/error-page';
import {
  BaPageService,
  BaPageGuard,
} from '@dynatrace/shared/data-access-strapi';

export const nextRoutes: Route[] = [
  {
    path: 'index',
    redirectTo: '',
  },
  {
    path: 'overview',
    loadChildren: () =>
      import('./pages/index-page/index-page.module').then(
        (module) => module.NextIndexPageModule,
      ),
  },
  {
    path: 'design',
    loadChildren: () =>
      import('./pages/single-page/single-page.module').then(
        (module) => module.NextSinglePageModule,
      ),
  },
  {
    path: 'angular-components',
    loadChildren: () =>
      import('./pages/single-page/single-page.module').then(
        (module) => module.NextSinglePageModule,
      ),
  },
];

@NgModule({
  declarations: [NextErrorPage],
  imports: [
    CommonModule,
    RouterModule.forRoot(nextRoutes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      paramsInheritanceStrategy: 'always',
      enableTracing: false, // Can be set for debugging the router
      initialNavigation: 'enabled',
    }),
  ],
  exports: [RouterModule],
  providers: [BaPageService, BaPageGuard],
})
export class NextRoutingModule {}
