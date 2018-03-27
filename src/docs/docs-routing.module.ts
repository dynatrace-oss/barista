import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home, Docs } from './docs.component';
import { DocsDummyComponent } from 'components/dummy/docs-dummy.component';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'dummy', component: DocsDummyComponent },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class DocsRoutingModule {
}
