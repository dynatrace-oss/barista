import { Component } from '@angular/core';

@Component({
  templateUrl: 'drawer-demo.component.html',
  styleUrls: ['drawer-demo.component.scss'],
})
export class DrawerDemo {

  dynamicallyAdded = false;

  addDrawer(): void {
    this.dynamicallyAdded = !this.dynamicallyAdded;
  }
}
