import { Component, ViewChild } from '@angular/core';

import { DtDrawer } from '@dynatrace/angular-components/drawer';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  templateUrl: 'menu-demo.html',
  styleUrls: ['menu-demo.scss'],
})
export class MenuDemo {
  @ViewChild(DtDrawer, { static: true }) drawer: DtDrawer;

  toggle(): void {
    this.drawer.toggle();
  }

  doSomething(): void {
    window.alert('Did something!');
  }
}
