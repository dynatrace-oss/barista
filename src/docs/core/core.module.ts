import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LOG_APPENDER_PROVIDER, ConsoleAppender } from './console-appender';
import { DT_LOG_CONSUMER_PROVIDER } from '@dynatrace/angular-components';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    DT_LOG_CONSUMER_PROVIDER,
    ConsoleAppender,
    LOG_APPENDER_PROVIDER,
  ],
})
export class CoreModule {
}
