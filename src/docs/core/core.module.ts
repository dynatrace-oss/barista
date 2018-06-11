import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsoleAppender } from './console-appender';
import { DT_LOG_CONSUMER_PROVIDER } from '@dynatrace/angular-components';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    DT_LOG_CONSUMER_PROVIDER,
  ],
})
export class CoreModule {
}
