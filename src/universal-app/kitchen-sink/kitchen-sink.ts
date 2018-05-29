import {Component, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ServerModule} from '@angular/platform-server';
import {
  DtAlertModule,
  DtButtonModule,
  DtLoadingDistractorModule,
  DtTileModule,
  DtCardModule,
  DtContextDialogModule,
  DtButtonGroupModule,
  DtTableModule,
  DtTagModule,
  DtIconModule,
  DtShowMoreModule,
} from '@dynatrace/angular-components';

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
    DtAlertModule,
    DtButtonModule,
    DtTableModule,
    DtLoadingDistractorModule,
    DtTileModule,
    DtTagModule,
    DtCardModule,
    DtContextDialogModule,
    DtButtonGroupModule,
    DtShowMoreModule,
    // TODO @thomaspink: Add again if universal supports XHR.
    // Issue: ***REMOVED***/***REMOVED***
    // DtIconModule.forRoot({svgIconLocation: '/lib/assets/icons/{{name}}.svg'}),
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
