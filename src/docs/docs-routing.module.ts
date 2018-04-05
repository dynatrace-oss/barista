import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Docs } from './docs.component';
import { Home } from './docs-home/docs-home.component';
import { DocsButtonComponent } from 'components/button/docs-button.component';
import { DocsButtongroupComponent } from 'components/buttongroup/docs-buttongroup.component';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'button', component: DocsButtonComponent },
  { path: 'buttongroup', component: DocsButtongroupComponent },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class DocsRoutingModule {
}
