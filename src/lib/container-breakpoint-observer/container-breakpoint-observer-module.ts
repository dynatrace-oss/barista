import { NgModule } from '@angular/core';

import { DtContainerBreakpointObserver } from './container-breakpoint-observer';
import { DtIfContainerBreakpoint } from './if-container-breakpoint';

@NgModule({
  exports: [DtContainerBreakpointObserver, DtIfContainerBreakpoint],
  declarations: [DtContainerBreakpointObserver, DtIfContainerBreakpoint],
  imports: [],
})
export class DtContainerBreakpointObserverModule {}
