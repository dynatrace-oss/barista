import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  DtDrawerContainer,
  DtDrawer,
} from '@dynatrace/angular-components/drawer';

@Component({
  moduleId: module.id,
  selector: 'dt-drawer-ui',
  templateUrl: 'drawer-ui.html',
})
export class DrawerUI {
  openCount = 0;
  closeCount = 0;

  @ViewChild('container', { static: true }) container: DtDrawerContainer;
  @ViewChild('drawer', { static: true }) drawer: DtDrawer;
  @ViewChild('toggleButton', { static: true }) drawerButton: ElementRef<
    HTMLButtonElement
  >;
  @ViewChild('openButton', { static: true }) openButton: ElementRef<
    HTMLButtonElement
  >;
  @ViewChild('closeButton', { static: true }) closeButton: ElementRef<
    HTMLButtonElement
  >;

  open(): void {
    this.openCount++;
  }
  close(): void {
    this.closeCount++;
  }
}
