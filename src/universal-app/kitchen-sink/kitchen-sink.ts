import {Component, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ServerModule} from '@angular/platform-server';
import {DtButtonModule, DtLoadingDistractorModule, DtTileModule, DtCardModule} from '@dynatrace/angular-components';

@Component({
  selector: 'dt-kitchen-sink',
  templateUrl: './kitchen-sink.html',
})
export class KitchenSink {}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({appId: 'kitchen-sink'}),
    DtButtonModule,
    DtLoadingDistractorModule,
    DtTileModule,
    DtCardModule,
  ],
  bootstrap: [KitchenSink],
  declarations: [KitchenSink],
  entryComponents: [KitchenSink],
})
export class KitchenSinkClientModule { }

@NgModule({
  imports: [KitchenSinkClientModule, ServerModule],
  bootstrap: [KitchenSink],
  entryComponents: [KitchenSink],
})
export class KitchenSinkServerModule { }
