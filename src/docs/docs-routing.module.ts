import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Docs } from './docs.component';
import { Home } from './docs-home/docs-home.component';
import { DocsButtonComponent } from 'components/button/docs-button.component';
import { DocsButtonGroupComponent } from 'components/button-group/docs-button-group.component';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'button', component: DocsButtonComponent },
  { path: 'button-group', component: DocsButtonGroupComponent },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class DocsRoutingModule {
}
