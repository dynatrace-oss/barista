import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocsLinkComponent } from './components/link/docs-link.component';
import { Home } from './docs-home/docs-home.component';
import { DocsButtonComponent } from './components/button/docs-button.component';
import { DocsButtonGroupComponent } from './components/button-group/docs-button-group.component';
import { DocsInputComponent } from './components/input/docs-input.component';
import { DocsInlineEditorComponent } from './components/inline-editor/docs-inline-editor.component';
import { DocsLoadingDistractorComponent } from './components/loading-distractor/docs-loading-distractor.component';
import { DocsExpandablePanelComponent } from './components/expandable-panel/docs-expandable-panel.component';
import { DocsExpandableSectionComponent } from './components/expandable-section/docs-expandable-section.component';
import { DocsTableComponent } from './components/table/docs-table.component';
import { DocsChartComponent } from './components/chart/docs-chart.component';
import { DocsTileComponent } from './components/tile/docs-tile.component';
import { DocsCardComponent } from './components/card/docs-card.component';
import { DocsContextDialogComponent } from './components/context-dialog/docs-context-dialog.component';
import { DocsFormField } from 'components/form-field/docs-form-field';
import { DocsTagComponent } from './components/tag/docs-tag.component';
import { DocsAlertComponent } from './components/alert/docs-alert.component';
import { DocsIconComponent } from 'components/icon/docs-icon.component';
import { DocsCopyClipboardComponent } from 'components/copy-clipboard/docs-copy-clipboard.component';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'button', component: DocsButtonComponent },
  { path: 'button-group', component: DocsButtonGroupComponent },
  { path: 'card', component: DocsCardComponent },
  { path: 'chart', component: DocsChartComponent },
  { path: 'context-dialog', component: DocsContextDialogComponent },
  { path: 'input', component: DocsInputComponent },
  { path: 'expandable-panel', component: DocsExpandablePanelComponent },
  { path: 'inline-editor', component: DocsInlineEditorComponent },
  { path: 'expandable-section', component: DocsExpandableSectionComponent },
  { path: 'input', component: DocsInputComponent },
  { path: 'form-field', component: DocsFormField },
  { path: 'icon', component: DocsIconComponent },
  { path: 'loading-distractor', component: DocsLoadingDistractorComponent },
  { path: 'links', component: DocsLinkComponent },
  { path: 'table', component: DocsTableComponent },
  { path: 'tile', component: DocsTileComponent },
  { path: 'tag', component: DocsTagComponent },
  { path: 'alert-component', component: DocsAlertComponent },
  { path: 'copy-clipboard', component: DocsCopyClipboardComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class DocsRoutingModule { }
