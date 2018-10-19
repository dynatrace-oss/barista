import {Component, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ServerModule} from '@angular/platform-server';
import { RouterModule } from '@angular/router';
import { DtAlertModule } from '@dynatrace/angular-components/alert';
import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtCheckboxModule } from '@dynatrace/angular-components/checkbox';
import { DtLoadingDistractorModule } from '@dynatrace/angular-components/loading-distractor';
import { DtTileModule } from '@dynatrace/angular-components/tile';
import { DtCardModule } from '@dynatrace/angular-components/card';
import { DtContextDialogModule } from '@dynatrace/angular-components/context-dialog';
import { DtButtonGroupModule } from '@dynatrace/angular-components/button-group';
import { DtTableModule } from '@dynatrace/angular-components/table';
import { DtTagModule } from '@dynatrace/angular-components/tag';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { DtPaginationModule } from '@dynatrace/angular-components/pagination';
import { DtRadioModule } from '@dynatrace/angular-components/radio';
import { DtShowMoreModule } from '@dynatrace/angular-components/show-more';
import { DtSwitchModule } from '@dynatrace/angular-components/switch';
import { DtProgressBarModule } from '@dynatrace/angular-components/progress-bar';
import { DtProgressCircleModule } from '@dynatrace/angular-components/progress-circle';
import { DtBreadcrumbsModule } from '@dynatrace/angular-components/breadcrumbs';
import { DtCopyToClipboardModule } from '@dynatrace/angular-components/copy-to-clipboard';
import { DtTabsModule } from '@dynatrace/angular-components/tabs';
import { DtSelectModule } from '@dynatrace/angular-components/select';
import { DtInputModule } from '@dynatrace/angular-components/input';
import { DtOverlayModule } from '@dynatrace/angular-components/overlay';
import { DtAutocompleteModule } from '@dynatrace/angular-components/autocomplete';

@Component({
  selector: 'dt-kitchen-sink',
  templateUrl: './kitchen-sink.html',
})
export class KitchenSink {
  tableDataSource: object[] = [
    { host: 'et-demo-2-win4' },
    { host: 'et-demo-2-win6' },
    { host: 'et-demo-2-win8' },
  ];
}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({appId: 'kitchen-sink'}),
    RouterModule.forRoot([]),
    DtAlertModule,
    DtAutocompleteModule,
    DtButtonModule,
    DtCheckboxModule,
    DtTableModule,
    DtLoadingDistractorModule,
    DtTileModule,
    DtTagModule,
    DtCardModule,
    DtContextDialogModule,
    DtCopyToClipboardModule,
    DtButtonGroupModule,
    DtIconModule.forRoot({svgIconLocation: '/lib/assets/icons/{{name}}.svg'}),
    DtRadioModule,
    DtShowMoreModule,
    DtProgressCircleModule,
    DtPaginationModule,
    DtSwitchModule,
    DtBreadcrumbsModule,
    DtProgressBarModule,
    DtTabsModule,
    DtSelectModule,
    DtInputModule,
    DtOverlayModule,
  ],
  bootstrap: [KitchenSink],
  declarations: [KitchenSink],
  entryComponents: [KitchenSink],
})
export class KitchenSinkClientModule { }

@NgModule({
  imports: [
    KitchenSinkClientModule,
    ServerModule,
  ],
  bootstrap: [KitchenSink],
  entryComponents: [KitchenSink],
})
export class KitchenSinkServerModule { }
