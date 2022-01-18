/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { Location, LocationStrategy } from '@angular/common';
import { Component, DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DtTabGroup } from '../tab-group';
import { checkSelected } from '../tab-group.spec';
import { DtTabsModule } from '../tabs-module';
import {
  DtTabNavigationAdapter,
  DtTabRouterFragmentAdapter,
} from './tab-navigation-adapter';

describe('DtTabRouterFragmentAdapter', () => {
  let location: Location;
  let router: Router;
  let fixture: ComponentFixture<AppComponent>;
  let tabGroupDebug: DebugElement;
  let tabsDebug: DebugElement[];
  let tabComponentInstance: TabComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DtTabsModule,
        RouterTestingModule.withRoutes([{ path: '', component: TabComponent }]),
      ],
      declarations: [TabComponent, AppComponent],
      providers: [
        {
          provide: DtTabNavigationAdapter,
          useClass: DtTabRouterFragmentAdapter,
          deps: [Router, ActivatedRoute, Location, LocationStrategy],
        },
      ],
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    fixture = TestBed.createComponent(AppComponent);
  });

  describe('without initial fragment', () => {
    beforeEach(fakeAsync(() => {
      router.initialNavigation();
      tick();
      fixture.detectChanges();
      tabGroupDebug = fixture.debugElement.query(By.directive(DtTabGroup));
      tabsDebug = tabGroupDebug.queryAll(By.css('.dt-tab-label'));
      tabComponentInstance = fixture.debugElement.query(
        By.directive(TabComponent),
      ).componentInstance;
    }));

    it('should update the fragment on user interaction', fakeAsync(() => {
      tabsDebug[0].nativeElement.click();
      fixture.detectChanges();
      tick();
      expect(location.path(true)).toBe('/#traffic');
      tabsDebug[2].nativeElement.click();
      fixture.detectChanges();
      tick();
      expect(location.path(true)).toBe('/#quality');
    }));

    it('should not update fragment on disabled tab click', fakeAsync(() => {
      tabsDebug[0].nativeElement.click();
      fixture.detectChanges();
      tick();
      expect(location.path(true)).toBe('/#traffic');

      tabComponentInstance.disablePackets = true;
      fixture.detectChanges();

      tabsDebug[1].nativeElement.click();
      fixture.detectChanges();
      tick();
      expect(location.path(true)).toBe('/#traffic');
    }));

    it('should not update the fragment on programmatic selection change', fakeAsync(() => {
      tabComponentInstance.selected = 'traffic';
      fixture.detectChanges();
      tick();
      expect(location.path(true)).toBe('/');
    }));

    it('should save ids of different tabgroups in the fragment', fakeAsync(() => {
      const secondTabGroupDebug = fixture.debugElement.queryAll(
        By.directive(DtTabGroup),
      )[1];
      const secondTabsDebug = secondTabGroupDebug.queryAll(
        By.css('.dt-tab-label'),
      );

      tabsDebug[0].nativeElement.click();
      fixture.detectChanges();
      tick();
      expect(location.path(true)).toBe('/#traffic');
      secondTabsDebug[1].nativeElement.click();
      fixture.detectChanges();
      tick();
      expect(location.path(true)).toBe('/#traffic,physical-cpu');
    }));
  });

  describe('with initial fragment', () => {
    it('should set the selected tab to the tab that matches the fragment', fakeAsync(() => {
      location.go('/#packets');
      router.initialNavigation();
      tick();
      fixture.detectChanges();
      checkSelected(1, fixture);
    }));

    it('should set the selected tab to the tab that matches the fragment with multiple ids', fakeAsync(() => {
      location.go('/#packets,cpu-ready-time');
      router.initialNavigation();
      tick();
      fixture.detectChanges();
      checkSelected(1, fixture);
      checkSelected(5, fixture);
    }));

    it('should set the first found id within a tabgroup and ingore the second', fakeAsync(() => {
      location.go('/#packets,traffic');
      router.initialNavigation();
      tick();
      fixture.detectChanges();
      checkSelected(1, fixture);
      checkSelected(0, fixture, false);
    }));
  });
});

@Component({
  template: `
    <dt-tab-group dtTabGroupNavigation>
      <dt-tab id="traffic" [selected]="selected === 'traffic'">
        <ng-template dtTabLabel>Traffic</ng-template>
        <ng-template dtTabContent>
          <h1>Traffic</h1>
        </ng-template>
      </dt-tab>
      <dt-tab id="packets" [disabled]="disablePackets">
        <ng-template dtTabLabel>Packets</ng-template>
        <ng-template dtTabContent>
          <h1>Packets</h1>
        </ng-template>
      </dt-tab>
      <dt-tab id="quality" [selected]="selected === 'quality'">
        <ng-template dtTabLabel>Quality</ng-template>
        <ng-template dtTabContent>
          <h1>Quality</h1>
        </ng-template>
      </dt-tab>
    </dt-tab-group>
    <dt-tab-group dtTabGroupNavigation>
      <dt-tab id="cpu-usage">
        <ng-template dtTabLabel>CPU Usage</ng-template>
        <ng-template dtTabContent>
          <h1>CPU Usage</h1>
        </ng-template>
      </dt-tab>
      <dt-tab id="physical-cpu">
        <ng-template dtTabLabel>Physical CPU</ng-template>
        <ng-template dtTabContent>
          <h1>Physical CPU</h1>
        </ng-template>
      </dt-tab>
      <dt-tab id="cpu-ready-time">
        <ng-template dtTabLabel>CPU ready time</ng-template>
        <ng-template dtTabContent>
          <h1>CPU ready time</h1>
        </ng-template>
      </dt-tab>
    </dt-tab-group>
  `,
})
export class TabComponent {
  selected = 'quality';
  disablePackets = false;
}

@Component({
  template: ` <router-outlet></router-outlet> `,
})
export class AppComponent {}
