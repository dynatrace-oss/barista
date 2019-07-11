import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-drawer-container class="drawer">
      <dt-drawer #outerDrawer mode="side">
        Outer drawer content
      </dt-drawer>

      <h2>Hosting units</h2>
      <p>There can be some text before the second drawer will appear</p>

      <dt-drawer-container class="inner-drawer">
        <dt-drawer #innerDrawer mode="over" position="end">
          Inner drawer content
        </dt-drawer>

        I'm the content of the
        <b>inner</b>
        drawer
        <button dt-button (click)="innerDrawer.toggle()">
          Toggle inner drawer
        </button>
      </dt-drawer-container>

      I'm the content of the
      <b>outer</b>
      drawer
    </dt-drawer-container>

    <button dt-button (click)="outerDrawer.toggle()">
      Toggle outer drawer
    </button>
  `,
  styles: [
    `
      .drawer {
        border: 1px solid #cccccc;
        margin-bottom: 20px;
      }
      .inner-drawer {
        height: 200px;
        border: 1px solid #cccccc;
        margin: 20px 0;
      }
    `,
  ],
})
export class DrawerNestedExample {}
