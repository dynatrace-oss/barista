// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { DtTabsModule, DtTabGroup, DtTabNavigationAdapter, DtTabRouterFragmentAdapter } from '@dynatrace/angular-components';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy } from '@angular/common';
import { checkSelected } from '../tab-group.spec';

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
      declarations: [ TabComponent, AppComponent ],
      providers: [
        { provide: DtTabNavigationAdapter,
          useClass: DtTabRouterFragmentAdapter,
          deps: [Router, ActivatedRoute, Location, LocationStrategy],
        },
      ],
    });

    router = TestBed.get(Router);
    location = TestBed.get(Location);

    fixture = TestBed.createComponent(AppComponent);
  });

  describe('without initial fragment', () => {

    beforeEach(fakeAsync(() => {
      router.initialNavigation();
      tick();
      fixture.detectChanges();
      tabGroupDebug = fixture.debugElement.query(By.directive(DtTabGroup));
      tabsDebug = tabGroupDebug.queryAll(By.css('.dt-tab-label'));
      tabComponentInstance = fixture.debugElement.query(By.directive(TabComponent)).componentInstance;
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
      const secondTabGroupDebug = fixture.debugElement.queryAll(By.directive(DtTabGroup))[1];
      const secondTabsDebug = secondTabGroupDebug.queryAll(By.css('.dt-tab-label'));

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

    beforeEach(fakeAsync(() => {
      location.go('/#packets');
      router.initialNavigation();
      tick();
      fixture.detectChanges();
      tabGroupDebug = fixture.debugElement.query(By.directive(DtTabGroup));
      tabsDebug = tabGroupDebug.queryAll(By.css('.dt-tab-label'));
    }));

    it('should set the selected tab to the tab that matches the fragment', fakeAsync(() => {
      checkSelected(1, fixture);
    }));

    it('should set the selected tab to the tab that matches the fragment with multiple ids', fakeAsync(() => {
      location.go('/#packets,cpu-ready-time');
      tick();
      checkSelected(1, fixture);
      checkSelected(5, fixture);
    }));

    it('should set the first found id within a tabgroup and ingore the second', fakeAsync(() => {
      location.go('/#packets,traffic');
      tick();
      checkSelected(1, fixture);
      checkSelected(0, fixture, false);
    }));

  });

});

@Component({
  template:
  `<dt-tab-group dtTabGroupNavigation>
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
  </dt-tab-group>`,
})
export class TabComponent {
  selected = 'quality';
  disablePackets = false;
  secondGroup = true;
}

@Component({
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
}
