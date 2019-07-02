import { Component, ViewChild } from '@angular/core';
import { DtDrawer } from '@dynatrace/angular-components';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
  <dt-drawer-container class="drawer">
    <dt-drawer
      *ngIf="drawerPresent"
      #drawer
      [mode]="mode"
      [position]="position"
      opened>
      Drawer Content</dt-drawer>
    Main content
  </dt-drawer-container>

  <button
    dt-button
    (click)="addOrRemoveDrawer()">add / remove drawer</button>
  <button
    dt-button
    color="secondary"
    [disabled]="!drawerPresent"
    (click)="toggle()">toggle drawer</button>
  <dt-form-field>
    <dt-label>Select drawer mode:</dt-label>
    <dt-select [(value)]="mode">
      <dt-option value="side" default>Side Mode</dt-option>
      <dt-option value="over">Over mode</dt-option>
    </dt-select>
  </dt-form-field>
  <dt-form-field>
    <dt-label>Select drawer position:</dt-label>
    <dt-select [(value)]="position">
      <dt-option value="start">Start</dt-option>
      <dt-option value="end">End</dt-option>
    </dt-select>
  </dt-form-field>`,
  styles: [`
    .drawer {
      height: 300px;
      border: 1px solid #cccccc;
      margin-bottom: 20px;
    }
  `],
})
export class DrawerDynamicExample {
  drawerPresent = false;
  mode = 'side';
  position = 'start';
  @ViewChild('drawer', { static: true }) drawer: DtDrawer;

  addOrRemoveDrawer(): void {
    this.drawerPresent = !this.drawerPresent;
  }

  toggle(): void {
    this.drawer.toggle();
  }
}
