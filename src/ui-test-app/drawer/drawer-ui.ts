import {Component, ElementRef, ViewChild} from '@angular/core';
import { DtDrawerContainer, DtDrawer } from '@dynatrace/angular-components';

@Component({
  moduleId: module.id,
  selector: 'dt-drawer-ui',
  templateUrl: 'drawer-ui.html',
})
export class DrawerUI {
  openCount = 0;
  closeCount = 0;

  @ViewChild('container') container: DtDrawerContainer;
  @ViewChild('drawer') drawer: DtDrawer;
  @ViewChild('toggleButton') drawerButton: ElementRef<HTMLButtonElement>;
  @ViewChild('openButton') openButton: ElementRef<HTMLButtonElement>;
  @ViewChild('closeButton') closeButton: ElementRef<HTMLButtonElement>;

  open(): void { this.openCount++; }
  close(): void { this.closeCount++; }
}
