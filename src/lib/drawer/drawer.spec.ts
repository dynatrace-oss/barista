import { Component, ViewChild, ElementRef, Type, Injectable } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { async, TestBed, tick, fakeAsync, flush, ComponentFixture, inject } from '@angular/core/testing';
import {
  DT_DRAWER_OPEN_CLASS,
  DtDrawerContainer,
  getDtDuplicateDrawerError,
  DtDrawer,
  DtDrawerModule,
} from '@dynatrace/angular-components';
import { BreakpointObserver, MediaMatcher, LayoutModule } from '@angular/cdk/layout';
import { dispatchKeyboardEvent } from '../../testing/dispatch-events';
import { ESCAPE } from '@angular/cdk/keycodes';

function getVisibility(element: HTMLElement): boolean {
  const { x, right, width } = element.getBoundingClientRect() as DOMRect;
  const offsetX = x < 0 ? x * -1 : x;
  return right + offsetX > width;
}

function createFixture<T>(component: Type<T>): {
  fixture: ComponentFixture<T>;
  instance: T;
  containerEl: HTMLElement;
} {
  const fixture = TestBed.createComponent(component);
  return {
    fixture,
    instance: fixture.debugElement.componentInstance,
    containerEl: fixture.debugElement.query(By.css('dt-drawer-container')).nativeElement,
  };
}

describe('DtDrawer', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DtDrawerModule,
        NoopAnimationsModule,
      ],
      declarations: [
        NoDrawerTestApp,
        BasicTestApp,
        FailingTestApp,
        TestAppOverMode,
        TestAppDrawerOpened,
        TestAppWithOverAndSideMode,
      ],
    });

    TestBed.compileComponents();
  }));

  describe('validate drawers', () => {
    it('should throw if there are two drawers with the same mode in the container', () => {
      const { instance, fixture } = createFixture<FailingTestApp>(FailingTestApp);

      expect(fakeAsync(() => {
        fixture.detectChanges();
        flush();
      })).toThrow(getDtDuplicateDrawerError('start'));

      instance.secondDrawer.position = 'end';

      expect(fakeAsync(() => {
        // when the mode is changed it should get checked again
        fixture.detectChanges();
        flush();
      })).not.toThrowError();
    });

    it('does not throw when created without a drawer', fakeAsync(() => {
      expect(() => {
        const { fixture } = createFixture<NoDrawerTestApp>(NoDrawerTestApp);
        fixture.detectChanges();
        tick();
      }).not.toThrowError();
    }));
  });

  describe('drawer methods', () => {

    it('should fire the open event when open on init', fakeAsync(() => {
      const { fixture, instance } = createFixture<TestAppDrawerOpened>(TestAppDrawerOpened);
      fixture.detectChanges();
      flush();

      expect(instance.drawer.opened).toBeTruthy('Expect drawer to be open');
    }));

    it('should open the drawer by calling its open function programmatically', fakeAsync(() => {
      const { instance, containerEl, fixture } = createFixture<BasicTestApp>(BasicTestApp);
      fixture.detectChanges();
      flush();

      expect(containerEl.classList.contains(DT_DRAWER_OPEN_CLASS)).toBeFalsy();
      instance.drawer.open();
      fixture.detectChanges();
      flush();

      expect(containerEl.classList.contains(DT_DRAWER_OPEN_CLASS)).toBeTruthy();
    }));

    it('should be able to open the drawer by clicking a button', fakeAsync(() => {
      const { instance, containerEl, fixture } = createFixture<BasicTestApp>(BasicTestApp);
      fixture.detectChanges();

      fixture.debugElement.query(By.css('.open')).nativeElement.click();
      fixture.detectChanges();
      tick(); // open animation should be finished
      expect(instance.openCount).toBe(1);
      expect(containerEl.classList.contains(DT_DRAWER_OPEN_CLASS)).toBeTruthy();
    }));

    it('should close the drawer by calling its close function programmatically', fakeAsync(() => {
      const { instance, containerEl, fixture } = createFixture<TestAppDrawerOpened>(TestAppDrawerOpened);
      fixture.detectChanges();
      flush();

      expect(containerEl.classList.contains(DT_DRAWER_OPEN_CLASS)).toBeTruthy();
      instance.drawer.close();
      fixture.detectChanges();
      flush();

      expect(containerEl.classList.contains(DT_DRAWER_OPEN_CLASS)).toBeFalsy();
    }));

    it('should be able to close the drawer by clicking a button', fakeAsync(() => {
      const { instance, containerEl, fixture } = createFixture<BasicTestApp>(BasicTestApp);
      instance.drawer.open();
      fixture.detectChanges();
      flush();
      expect(containerEl.classList.contains(DT_DRAWER_OPEN_CLASS)).toBeTruthy();

      fixture.debugElement.query(By.css('.close')).nativeElement.click();
      fixture.detectChanges();
      flush();
      expect(instance.closeCount).toBe(1);
      expect(containerEl.classList.contains(DT_DRAWER_OPEN_CLASS)).toBeFalsy();
    }));
  });

  describe('drawer behaviors', () => {
    it('should move the drawer outside the content area with a transform when it is not visible', fakeAsync(() => {
      const { instance, containerEl, fixture } = createFixture<BasicTestApp>(BasicTestApp);
      const drawer = fixture.debugElement.query(By.css('dt-drawer'));
      fixture.detectChanges();
      flush();

      expect(containerEl.classList.contains(DT_DRAWER_OPEN_CLASS)).toBeFalsy();
      expect(getVisibility(drawer.nativeElement)).toBeFalsy();

      instance.drawer.open();
      fixture.detectChanges();
      flush();

      expect(containerEl.classList.contains(DT_DRAWER_OPEN_CLASS)).toBeTruthy();
      expect(getVisibility(drawer.nativeElement)).toBeTruthy();
    }));
  });

  describe('container methods', () => {
    it('should open all drawers when the open function is called on the container', fakeAsync(() => {
      const { instance, fixture } = createFixture<TestAppWithOverAndSideMode>(TestAppWithOverAndSideMode);
      fixture.detectChanges();
      flush();

      expect(instance.drawer1.opened).toBeFalsy();
      expect(instance.drawer2.opened).toBeFalsy();

      instance.container.open();
      fixture.detectChanges();
      flush();

      expect(instance.drawer1.opened).toBeTruthy();
      expect(instance.drawer2.opened).toBeTruthy();
    }));

    it('should close all drawers when the close function is called on the container', fakeAsync(() => {
      const { instance, fixture, containerEl } = createFixture<TestAppWithOverAndSideMode>(TestAppWithOverAndSideMode);
      fixture.detectChanges();
      flush();

      instance.container.open();
      fixture.detectChanges();
      flush();

      expect(instance.drawer1.opened).toBeTruthy();
      expect(instance.drawer2.opened).toBeTruthy();
      expect(containerEl.classList.contains(DT_DRAWER_OPEN_CLASS)).toBeTruthy();

      instance.container.close();
      fixture.detectChanges();
      flush();

      expect(instance.drawer1.opened).toBeFalsy();
      expect(instance.drawer2.opened).toBeFalsy();
      expect(containerEl.classList.contains(DT_DRAWER_OPEN_CLASS)).toBeFalsy();
    }));
  });

  describe('container behaviors', () => {
    it('should have a backdrop element if it is in over mode', fakeAsync(() => {
      const { containerEl, fixture } = createFixture<TestAppOverMode>(TestAppOverMode);
      fixture.detectChanges();
      flush();

      const backdrop = fixture.debugElement.query(By.css('.dt-drawer-backdrop'));
      expect(backdrop).not.toBeUndefined();

      expect(containerEl.classList.contains(DT_DRAWER_OPEN_CLASS)).toBeFalsy();
      expect(getVisibility(backdrop.nativeElement)).toBeFalsy();

      // Now open the panel
      fixture.debugElement.query(By.css('.open')).nativeElement.click();
      fixture.detectChanges();
      flush(); // open animation should be finished

      // now the backdrop should be visible
      expect(containerEl.classList.contains(DT_DRAWER_OPEN_CLASS)).toBeTruthy();
      expect(getVisibility(backdrop.nativeElement)).toBeTruthy();
    }));

    it('should close over mode when click on backdrop area', fakeAsync(() => {
      const { containerEl, fixture } = createFixture<TestAppOverMode>(TestAppOverMode);
      fixture.detectChanges();
      flush();

      fixture.debugElement.query(By.css('.open')).nativeElement.click();
      fixture.detectChanges();
      flush(); // open animation should be finished

      expect(containerEl.classList.contains(DT_DRAWER_OPEN_CLASS)).toBeTruthy();

      const backdrop = fixture.debugElement.query(By.css('.dt-drawer-backdrop')).nativeElement;
      // click on backdrop to close drawer
      backdrop.click();
      fixture.detectChanges();
      flush();

      expect(containerEl.classList.contains(DT_DRAWER_OPEN_CLASS)).toBeFalsy();
    }));

    it('should close when pressing escape', fakeAsync(() => {
      const { instance, fixture, containerEl } = createFixture<BasicTestApp>(BasicTestApp);
      const drawer = instance.drawer;
      fixture.detectChanges();

      drawer.open();
      fixture.detectChanges();
      tick();

      expect(instance.openCount).toBe(1, 'Expected one open event.');
      expect(instance.closeCount).toBe(0, 'Expected no close events.');

      dispatchKeyboardEvent(containerEl, 'keydown', ESCAPE);
      fixture.detectChanges();
      flush();

      expect(instance.closeCount).toBe(1, 'Expected one close event.');
    }));

  });

  describe('accessibility', () => {
    it('should have an aria-hidden on the drawer when it is not shown', fakeAsync(() => {
      const { instance, containerEl, fixture } = createFixture<BasicTestApp>(BasicTestApp);
      fixture.detectChanges();
      flush();

      const drawer = containerEl.querySelector('dt-drawer') as HTMLElement;
      expect(drawer.getAttribute('aria-hidden')).toBeTruthy();

      instance.drawer.open();
      fixture.detectChanges();
      flush();

      expect(drawer.getAttribute('aria-hidden')).toBeFalsy();
    }));
  });

  describe('check subscriptions', () => {
    it('should unsubscribe drawer from _stateChanges', fakeAsync(() => {
      const { instance, fixture } = createFixture<BasicTestApp>(BasicTestApp);
      fixture.detectChanges();
      flush();
      const drawer = instance.drawer;
      const container = instance.container;

      expect(drawer._stateChanges.isStopped).toBeFalsy();

      drawer.ngOnDestroy();
      container.ngOnDestroy();

      expect(drawer._stateChanges.isStopped).toBeTruthy();
    }));

    it('should unsubscribe drawer from _animationStarted and _animationEnd', fakeAsync(() => {
      const { instance } = createFixture<BasicTestApp>(BasicTestApp);
      const drawer = instance.drawer;

      expect(drawer._animationStarted.isStopped).toBeFalsy();
      expect(drawer._animationEnd.isStopped).toBeFalsy();

      drawer.ngOnDestroy();
      expect(drawer._animationStarted.isStopped).toBeTruthy();
      expect(drawer._animationEnd.isStopped).toBeTruthy();
    }));
  });
});

describe('DtDrawer screen sizes', () => {
  let breakpointManager: BreakpointObserver;
  let mediaMatcher: FakeMediaMatcher;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        LayoutModule,
        DtDrawerModule,
        NoopAnimationsModule,
      ],
      declarations: [
        BasicTestApp,
      ],
      providers: [{provide: MediaMatcher, useClass: FakeMediaMatcher}],
    });
    TestBed.compileComponents();
  }));

  beforeEach(inject(
    [BreakpointObserver, MediaMatcher],
    (bm: BreakpointObserver, mm: FakeMediaMatcher) => {
      breakpointManager = bm;
      mediaMatcher = mm;
    }
  ));

  afterEach(() => {
    mediaMatcher.clear();
  });

  it('should change the side mode to an over mode at a screen size less than 1024px', fakeAsync(() => {
    const { instance, fixture } = createFixture<BasicTestApp>(BasicTestApp);
    const query = '(max-width: 1024px)';
    breakpointManager.observe(query).subscribe();
    mediaMatcher.setMatchesQuery(query, false);
    fixture.detectChanges();
    flush();

    expect(breakpointManager.isMatched(query)).toBeFalsy();
    expect(instance.drawer._currentMode).toBe('side');

    mediaMatcher.setMatchesQuery(query, true);
    fixture.detectChanges();
    flush();

    expect(breakpointManager.isMatched(query)).toBeTruthy();
    expect(instance.drawer._currentMode).toBe('over');

    mediaMatcher.setMatchesQuery(query, false);
    fixture.detectChanges();
    flush();

    expect(breakpointManager.isMatched(query)).toBeFalsy();
    expect(instance.drawer._currentMode).toBe('side');
  }));

  it('should stay in over mode if in resize the mode was changed by the user', fakeAsync(() => {
    const { instance, fixture } = createFixture<BasicTestApp>(BasicTestApp);
    const query = '(max-width: 1024px)';
    breakpointManager.observe(query).subscribe();
    mediaMatcher.setMatchesQuery(query, false);
    fixture.detectChanges();
    flush();

    expect(breakpointManager.isMatched(query)).toBeFalsy();
    expect(instance.drawer._currentMode).toBe('side');

    mediaMatcher.setMatchesQuery(query, true);
    fixture.detectChanges();
    flush();

    expect(breakpointManager.isMatched(query)).toBeTruthy();
    expect(instance.drawer._currentMode).toBe('over');

    instance.drawer.mode = 'over';
    fixture.detectChanges();
    expect(instance.drawer._currentMode).toBe('over');

    mediaMatcher.setMatchesQuery(query, false);
    fixture.detectChanges();
    flush();

    expect(breakpointManager.isMatched(query)).toBeFalsy();
    expect(instance.drawer._currentMode).toBe('over');
  }));
});

@Component({
  template: `
    <dt-drawer-container #container>
      <dt-drawer
        #drawer
        position="start"
        mode="side"
        (opened)="open()"
        (closed)="close()">Content</dt-drawer>
      <button (click)="drawer.open()" class="open" #openButton></button>
      <button (click)="drawer.close()" class="close" #closeButton></button>
    </dt-drawer-container>`,
})
class BasicTestApp {
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

@Component({
  template: `
    <dt-drawer-container>
      <dt-drawer
        #drawer
        opened>Content</dt-drawer>
    </dt-drawer-container>`,
})
class TestAppDrawerOpened {
  @ViewChild('drawer') drawer: DtDrawer;
}

@Component({ template: `<dt-drawer-container> </dt-drawer-container>` })
class NoDrawerTestApp { }

@Component({
  template: `
    <dt-drawer-container>
      <dt-drawer position="start" #firstDrawer>start drawer 1</dt-drawer>
      <dt-drawer position="start" #secondDrawer>second start drawer</dt-drawer>
      Main content
    </dt-drawer-container>`,
})
class FailingTestApp {
  @ViewChild('firstDrawer') firstDrawer: DtDrawer;
  @ViewChild('secondDrawer') secondDrawer: DtDrawer;
}

@Component({
  template: `
    <dt-drawer-container>
      <dt-drawer #drawer mode="over">drawer in over mode</dt-drawer>
      Main content
    </dt-drawer-container>
    <button (click)="drawer.open()" class="open"></button>
  `,
})
class TestAppOverMode {}

@Component({
  template: `
    <dt-drawer-container #container>
      <dt-drawer #drawer1>start drawer 1</dt-drawer>
      <dt-drawer
        #drawer2
        mode="over"
        position="end">second start drawer</dt-drawer>
      Main content
    </dt-drawer-container>`,
})
class TestAppWithOverAndSideMode {
  @ViewChild('container') container: DtDrawerContainer;
  @ViewChild('drawer1') drawer1: DtDrawer;
  @ViewChild('drawer2') drawer2: DtDrawer;
}

export class FakeMediaQueryList {
  /** The callback for change events. */
  addListenerCallback?: (mql: MediaQueryListEvent) => void;

  constructor(public matches: boolean, public media: string) {}

  /** Toggles the matches state and "emits" a change event. */
  setMatches(matches: boolean): void {
    this.matches = matches;
    // tslint:disable-next-line: no-any
    this.addListenerCallback!(this as any);
  }

  /** Registers the callback method for change events. */
  addListener(callback: (mql: MediaQueryListEvent) => void): void {
    this.addListenerCallback = callback;
  }

  // Noop removal method for testing.
  removeListener(): void { }
}

@Injectable()
export class FakeMediaMatcher extends MediaMatcher {
  /** A map of match media queries. */
  private queries = new Map<string, FakeMediaQueryList>();

  /** The number of distinct queries created in the media matcher during a test. */
  get queryCount(): number {
    return this.queries.size;
  }

  /** Fakes the match media response to be controlled in tests. */
  // tslint:disable-next-line: no-any
  matchMedia(query: string): any {
    const mql = new FakeMediaQueryList(true, query);
    this.queries.set(query, mql);
    return mql;
  }

  /** Clears all queries from the map of queries. */
  clear(): void {
    this.queries.clear();
  }

  // /** Toggles the matching state of the provided query. */
  setMatchesQuery(query: string, matches: boolean): void {
    if (this.queries.has(query)) {
      this.queries.get(query)!.setMatches(matches);
    } else {
      throw Error('This query is not being observed.');
    }
  }
}
