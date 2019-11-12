import { Component, OnInit, ViewChild } from '@angular/core';

import { DtContainerBreakpointObserver } from '@dynatrace/barista-components/container-breakpoint-observer';

@Component({
  moduleId: module.id,
  selector: 'container-breakpoint-observer-barista-example',
  template: `
    <dt-container-breakpoint-observer>
      <p>This is some placeholder text</p>
      <button dt-button>Some button</button>
    </dt-container-breakpoint-observer>
  `,
})
export class ContainerBreakpointObserverDefaultExample implements OnInit {
  @ViewChild(DtContainerBreakpointObserver, { static: true })
  breakpointObserver: DtContainerBreakpointObserver;

  ngOnInit(): void {
    this.breakpointObserver.observe('(min-width: 400px)').subscribe(event => {
      // tslint:disable-next-line: no-console
      console.log(`Matches '(min-width: 400px)':`, event.matches);
    });
  }
}
