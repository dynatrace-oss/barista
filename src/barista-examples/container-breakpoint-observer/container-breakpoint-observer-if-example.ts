import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'container-breakpoint-observer-barista-example',
  template: `
    <dt-container-breakpoint-observer>
      <p>This element is alway visible</p>
      <p *dtIfContainerBreakpoint="'(min-width:400px)'">
        This element is only visible if the container has at least a width of
        400px
      </p>
    </dt-container-breakpoint-observer>
  `,
})
export class ContainerBreakpointObserverIfExample {}
