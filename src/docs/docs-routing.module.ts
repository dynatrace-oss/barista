import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Docs } from './docs.component';
import { Home } from './docs-home/docs-home.component';
import { DocsButtonComponent } from './components/button/docs-button.component';
import { DocsButtonToggleComponent } from './components/button-toggle/docs-button-toggle.component';
import { DocsLoadingDistractorComponent } from './components/loading-distractor/docs-loading-distractor.component';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'button', component: DocsButtonComponent },
  { path: 'button-toggle', component: DocsButtonToggleComponent },
  { path: 'loading-distractor', component: DocsLoadingDistractorComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class DocsRoutingModule {
}
