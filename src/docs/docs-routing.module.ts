import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocsLinkComponent } from './components/link/docs-link.component';
import { Home } from './docs-home/docs-home.component';
import { DocsButtonComponent } from './components/button/docs-button.component';
import { DocsInputComponent } from './components/input/docs-input.component';
import { DocsLoadingDistractorComponent } from './components/loading-distractor/docs-loading-distractor.component';
import {DocsExpandablePanelComponent} from './components/expandable-panel/docs-expandable-panel.component';
import {DocsExpandableSectionComponent} from './components/expandable-section/docs-expandable-section.component';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'button', component: DocsButtonComponent },
  { path: 'input', component: DocsInputComponent },
  { path: 'expandable-panel', component: DocsExpandablePanelComponent },
  { path: 'expandable-section', component: DocsExpandableSectionComponent },
  { path: 'loading-distractor', component: DocsLoadingDistractorComponent },
  { path: 'links', component: DocsLinkComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class DocsRoutingModule {
}
