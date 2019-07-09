import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-drawer-container class="drawer">
      <dt-drawer #drawer mode="over" position="start">
        Drawer Content</dt-drawer
      >
      Main content
    </dt-drawer-container>

    <button dt-button (click)="drawer.toggle()">toggle drawer</button>
  `,
  styles: [
    `
      .drawer {
        height: 300px;
        border: 1px solid #cccccc;
        margin-bottom: 20px;
      }
    `,
  ],
})
export class DrawerOverExample {}
