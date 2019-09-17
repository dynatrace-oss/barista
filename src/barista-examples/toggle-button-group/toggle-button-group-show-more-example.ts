// tslint:disable: dt-icon-names

import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <dt-toggle-button-group>
      <button
        *ngFor="let buttonGroupItem of buttonGroupNames; let i = index"
        dt-toggle-button-item
        value="i + 1"
      >
        <dt-toggle-button-item-icon>
          <dt-icon name="cloud"></dt-icon>
        </dt-toggle-button-item-icon>
        {{ buttonGroupItem }}
      </button>
      <dt-expandable-text label="Show All" (click)="loadMore()">
      </dt-expandable-text>
    </dt-toggle-button-group>
  `,
  styles: [
    `
      :host ::ng-deep dt-toggle-button-group ::ng-deep button {
        margin: 18px 12px 0px 0px;
        width: 250px;
      }

      :host ::ng-deep dt-toggle-button-group ::ng-deep dt-expandable-text {
        display: inline-flex;
      }

      :host
        ::ng-deep
        dt-toggle-button-group
        ::ng-deep
        dt-expandable-text
        ::ng-deep
        button {
        width: auto;
      }

      :host
        ::ng-deep
        dt-toggle-button-group
        ::ng-deep
        dt-expandable-text
        ::ng-deep
        span
        ::ng-deep
        button {
        width: 250px;
      }
    `,
  ],
})
export class ToggleButtonGroupShowMoreExample implements OnInit {
  buttonGroupNames = new Set<string>();

  ngOnInit(): void {
    this.buttonGroupNames.add('1 CDN domain contacted');
    this.buttonGroupNames.add('6 3rd party resources');
    this.buttonGroupNames.add('1 CDN resource');
    this.buttonGroupNames.add('2 files downloaded');
    this.buttonGroupNames.add('725 1st party resources');
  }

  loadMore(): void {
    this.buttonGroupNames.add('4 CDN domains contacted');
    this.buttonGroupNames.add('64 3rd party resources');
  }
}
