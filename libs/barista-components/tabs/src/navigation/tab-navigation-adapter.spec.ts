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
import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { DtTabsModule } from '../tabs-module';
import {
  DtTabNavigationAdapter,
  DtTabRouterFragmentAdapter,
} from './tab-navigation-adapter';

import { createComponent } from '@dynatrace/testing/browser';

describe('DtTabNavigationAdapter', () => {
  let fixture: ComponentFixture<TabComponent>;
  let adapter: DtTabNavigationAdapter;
  let router: Router;

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
    fixture = createComponent(AppComponent);
  });

  describe('adapter functions', () => {
    beforeEach(fakeAsync(() => {
      adapter = TestBed.inject(DtTabNavigationAdapter);
    }));

    it('should register a tabgroup with the adapter after creation', fakeAsync(() => {
      jest.spyOn(adapter, 'registerTabControl');
      router.initialNavigation();
      tick();
      fixture.detectChanges();
      expect(adapter.registerTabControl).toHaveBeenCalledTimes(1);
    }));

    it('should unregister a tabgroup with the adapter after destroy', fakeAsync(() => {
      jest.spyOn(adapter, 'unregisterTabControl');
      router.initialNavigation();
      tick();
      fixture.detectChanges();
      fixture.destroy();
      expect(adapter.unregisterTabControl).toHaveBeenCalledTimes(1);
    }));
  });
});

@Component({
  selector: 'test-component',
  template: `
    <dt-tab-group dtTabGroupNavigation>
      <dt-tab id="traffic">
        <ng-template dtTabLabel>Traffic</ng-template>
        <ng-template dtTabContent>
          <h1>Traffic</h1>
        </ng-template>
      </dt-tab>
      <dt-tab id="quality">
        <ng-template dtTabLabel>Quality</ng-template>
        <ng-template dtTabContent>
          <h1>Quality</h1>
        </ng-template>
      </dt-tab>
    </dt-tab-group>
  `,
})
export class TabComponent {}

@Component({
  selector: 'test-component',
  template: ` <router-outlet></router-outlet> `,
})
export class AppComponent {}
