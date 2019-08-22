import { Component, ViewChild } from '@angular/core';

import { DtExpandableText } from '@dynatrace/angular-components/expandable-text';

// tslint:disable-next-line: use-component-selector
@Component({
  moduleId: module.id,
  templateUrl: './expandable-text-demo.component.html',
})
export class ExpandableTextDemo {
  isExpanded = true;

  @ViewChild(DtExpandableText, { static: true })
  expandableText: DtExpandableText;

  notifyMe(event: boolean): void {
    console.log('event', event);
  }

  expanded(): void {
    console.log('expanded');
  }

  collapsed(): void {
    console.log('collapsed');
  }

  open(): void {
    this.expandableText.open();
  }

  close(): void {
    this.expandableText.close();
  }

  toggle(): void {
    this.expandableText.toggle();
  }
}
