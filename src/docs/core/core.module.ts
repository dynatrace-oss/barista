import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LOG_APPENDER_INITIALIZER } from './console-appender';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    LOG_APPENDER_INITIALIZER,
  ],
})
export class CoreModule {
}
