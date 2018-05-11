import {Component, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ServerModule} from '@angular/platform-server';
import {
  DtButtonModule,
  DtLoadingDistractorModule,
  DtTileModule,
  DtCardModule,
  DtContextDialogModule,
  DtButtonGroupModule,
  DtTableModule,
  DtIconModule,
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
    DtButtonModule,
    DtTableModule,
    DtLoadingDistractorModule,
    DtTileModule,
    DtCardModule,
    DtContextDialogModule,
    DtButtonGroupModule,
    DtIconModule.forRoot({svgIconLocation: ''}),
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
