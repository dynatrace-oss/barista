import { BaristaModule } from './barista.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { KitchenSink } from './kitchen-sink/kitchen-sink';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'barista-components' }),
    BrowserAnimationsModule,
    BaristaModule,
  ],
  declarations: [KitchenSink],
  providers: [],
  bootstrap: [KitchenSink],
})
export class AppModule {}
