// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers deprecation
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import {
  DOWN_ARROW,
  END,
  ENTER,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  flush,
  inject,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { DtCardModule } from '@dynatrace/angular-components/card';
import {
  DtChart,
  DtChartSelectionAreaOrigin,
  getDtChartSelectionAreaDateTimeAxisError,
} from '@dynatrace/angular-components/chart';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import { DtSelectionAreaModule } from '@dynatrace/angular-components/selection-area';

import { createComponent } from '../../testing/create-component';
import {
  dispatchKeyboardEvent,
  dispatchMouseEvent,
} from '../../testing/dispatch-events';
import { MockNgZone } from '../../testing/mock-ng-zone';
import { tickRequestAnimationFrame } from '../../testing/request-animation-frame';
import { wrappedErrorMessage } from '../../testing/wrapped-error-message';
import { DtButtonModule } from '../button';
import { DtSelectionArea } from './selection-area';

// tslint:disable-next-line: dt-no-focused-tests
describe.skip('DtSelectionArea', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let zone: MockNgZone;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DtSelectionAreaModule,
        DtButtonModule,
        HttpClientTestingModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        DtCardModule,
      ],
      declarations: [
        BasicTest,
        BasicTestWithInitialTabIndex,
        DummyChart,
        ChartTest,
        DtChartSelectionAreaOrigin,
        ProjectedTest,
      ],
      providers: [
        { provide: NgZone, useFactory: () => (zone = new MockNgZone()) },
      ],
    });

    TestBed.compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();
  }));

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  describe('origin', () => {
    it('should make the origin tabable when a selection area is attached and the element has no tabindex', () => {
      const fixture = createComponent(BasicTest);
      const origin = fixture.componentInstance.origin;
      expect(origin.nativeElement.getAttribute('tabindex')).toBeDefined();
    });
    it('should not change the tabindex on the origin if it was already', () => {
      const fixture = createComponent(BasicTestWithInitialTabIndex);
      const origin = fixture.componentInstance.origin;
      expect(origin.nativeElement.getAttribute('tabindex')).toBe('10');
    });
    it('should position the selection-area over to the origin', fakeAsync(() => {
      const fixture = createComponent(BasicTest);
      const origin = fixture.componentInstance.origin;
      const originDomRect = origin.nativeElement.getBoundingClientRect();
      const globalSelectionAreaContainer = getGlobalSelectionAreaHost();
      zone.simulateZoneExit();
      fixture.detectChanges();
      const selectionArea: HTMLElement | null = globalSelectionAreaContainer!.querySelector(
        'dt-selection-area-container',
      );
      expect(selectionArea!.style.left).toEqual(`${originDomRect.left}px`);
      expect(selectionArea!.style.top).toEqual(`${originDomRect.top}px`);
      expect(selectionArea!.style.width).toEqual(`${originDomRect.width}px`);
      expect(selectionArea!.style.height).toEqual(`${originDomRect.height}px`);
    }));
  });

  describe('creation', () => {
    let fixture: ComponentFixture<any>;
    let origin: HTMLElement;
    let globalSelectionAreaContainer: HTMLElement | null;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(BasicTest);
      globalSelectionAreaContainer = getGlobalSelectionAreaHost();
      zone.simulateZoneExit();
      origin = fixture.componentInstance.origin.nativeElement;
    }));

    it('should create the selection area at the mouseposition on first mousemove', fakeAsync(() => {
      dispatchMouseEvent(origin, 'mousedown', 100, 10);
      fixture.detectChanges();
      flush();
      tickRequestAnimationFrame();
      dispatchMouseEvent(origin, 'mousemove', 100, 10);
      fixture.detectChanges();
      flush();
      tickRequestAnimationFrame();
      fixture.detectChanges();
      const selectedArea = getSelectionArea(globalSelectionAreaContainer!);
      expect(selectedArea.style.left).toEqual('90px');
    }));

    it('should scale the selection area on mousemove', fakeAsync(() => {
      dispatchMouseEvent(origin, 'mousedown', 100, 10);
      fixture.detectChanges();
      flush();
      tickRequestAnimationFrame();

      dispatchMouseEvent(window, 'mousemove', 200, 10);
      flush();
      tickRequestAnimationFrame();
      const selectedArea = getSelectionArea(globalSelectionAreaContainer!);
      expect(selectedArea.style.left).toEqual('90px');
      expect(selectedArea.style.width).toEqual('100px');
    }));

    it('should scale the selection area correctly when the mouse is moved to the left of the creation point', fakeAsync(() => {
      dispatchMouseEvent(origin, 'mousedown', 200, 10);
      fixture.detectChanges();
      flush();
      tickRequestAnimationFrame();

      dispatchMouseEvent(window, 'mousemove', 100, 10);
      flush();
      tickRequestAnimationFrame();
      const selectedArea = getSelectionArea(globalSelectionAreaContainer!);
      expect(selectedArea.style.left).toEqual('90px');
      expect(selectedArea.style.width).toEqual('100px');
    }));

    it('should scale the selection area correctly when the mouse is moved to the left and then to the right', fakeAsync(() => {
      dispatchMouseEvent(origin, 'mousedown', 200, 10);
      fixture.detectChanges();
      flush();
      tickRequestAnimationFrame();

      dispatchMouseEvent(window, 'mousemove', 100, 10);
      flush();
      tickRequestAnimationFrame();

      dispatchMouseEvent(window, 'mousemove', 300, 10);
      flush();
      tickRequestAnimationFrame();
      const selectedArea = getSelectionArea(globalSelectionAreaContainer!);
      expect(selectedArea.style.left).toEqual('190px');
      expect(selectedArea.style.width).toEqual('100px');
    }));

    it("should constrain the position to the origin's left edge", fakeAsync(() => {
      dispatchMouseEvent(origin, 'mousedown', 210, 10);
      fixture.detectChanges();
      flush();
      tickRequestAnimationFrame();

      dispatchMouseEvent(window, 'mousemove', 0, 10);
      flush();
      tickRequestAnimationFrame();
      const selectedArea = getSelectionArea(globalSelectionAreaContainer!);
      expect(selectedArea.style.left).toEqual('0px');
      expect(selectedArea.style.width).toEqual('200px');
    }));

    it("should constrain the position to the origin's right edge", fakeAsync(() => {
      dispatchMouseEvent(origin, 'mousedown', 20, 10);
      fixture.detectChanges();
      flush();
      tickRequestAnimationFrame();

      dispatchMouseEvent(window, 'mousemove', 420, 10);
      flush();
      tickRequestAnimationFrame();
      const selectedArea = getSelectionArea(globalSelectionAreaContainer!);
      expect(selectedArea.style.left).toEqual('10px');
      expect(selectedArea.style.width).toEqual('390px');
    }));

    it('should create an overlay on creation', fakeAsync(() => {
      dispatchMouseEvent(origin, 'mousedown', 100, 10);
      fixture.detectChanges();
      flush();
      tickRequestAnimationFrame();

      dispatchMouseEvent(window, 'mousemove', 200, 10);
      fixture.detectChanges();
      flush();
      tickRequestAnimationFrame();
      const overlayNative = overlayContainerElement.querySelector(
        '.dt-selection-area-overlay-pane',
      );
      expect(overlayNative).not.toBeNull();
    }));

    it('should not create a selection-area without a mousemove (click)', fakeAsync(() => {
      dispatchMouseEvent(origin, 'mousedown', 100, 10);
      fixture.detectChanges();
      flush();
      tickRequestAnimationFrame();
      dispatchMouseEvent(window, 'mouseup', 100, 10);
      fixture.detectChanges();
      flush();
      tickRequestAnimationFrame();
      fixture.detectChanges();
      const selectedArea = getSelectionArea(globalSelectionAreaContainer!);
      expect(selectedArea.style.visibility).toBe('hidden');
      const overlayNative = overlayContainerElement.querySelector(
        '.dt-selection-area-overlay-pane',
      );
      expect(overlayNative).toBeNull();
    }));
  });

  describe('mouse interaction', () => {
    let fixture: ComponentFixture<BasicTest>;
    let origin: HTMLElement;
    let selectedAreaNative: HTMLElement;
    let globalSelectionAreaContainer: HTMLElement | null;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(BasicTest);
      globalSelectionAreaContainer = getGlobalSelectionAreaHost();
      zone.simulateZoneExit();
      origin = fixture.componentInstance.origin.nativeElement;

      dispatchMouseEvent(origin, 'mousedown', 110, 10);
      fixture.detectChanges();
      flush();
      tickRequestAnimationFrame();

      dispatchMouseEvent(window, 'mousemove', 210, 10);
      flush();
      tickRequestAnimationFrame();
      dispatchMouseEvent(window, 'mouseup');
      flush();
      tickRequestAnimationFrame();
    }));

    describe('on the selectedArea', () => {
      beforeEach(fakeAsync(() => {
        selectedAreaNative = getSelectionArea(globalSelectionAreaContainer!);
        // position after this creation
        // left 100
        // width 100
        //     selectedArea
        //  | ----- |
        // 100     200
      }));

      it('should move the selectedArea 100px to the right', fakeAsync(() => {
        dispatchMouseEvent(selectedAreaNative, 'mousedown', 150, 10);
        fixture.detectChanges();
        flush();
        tickRequestAnimationFrame();
        dispatchMouseEvent(window, 'mousemove', 250, 10);
        flush();
        tickRequestAnimationFrame();
        selectedAreaNative = getSelectionArea(globalSelectionAreaContainer!);
        expect(selectedAreaNative.style.left).toEqual('200px');
        expect(selectedAreaNative.style.width).toEqual('100px');
      }));

      it('should move the selectedArea 50px to the left', fakeAsync(() => {
        dispatchMouseEvent(selectedAreaNative, 'mousedown', 150, 10);
        fixture.detectChanges();
        flush();
        tickRequestAnimationFrame();
        dispatchMouseEvent(window, 'mousemove', 100, 10);
        flush();
        tickRequestAnimationFrame();
        selectedAreaNative = getSelectionArea(globalSelectionAreaContainer!);
        expect(selectedAreaNative.style.left).toEqual('50px');
        expect(selectedAreaNative.style.width).toEqual('100px');
      }));

      it('should constrain the selectedArea to the origin', fakeAsync(() => {
        dispatchMouseEvent(selectedAreaNative, 'mousedown', 150, 10);
        fixture.detectChanges();
        flush();
        tickRequestAnimationFrame();
        // move the mouse to the edge of the window
        dispatchMouseEvent(window, 'mousemove', 0, 10);
        flush();
        tickRequestAnimationFrame();
        selectedAreaNative = getSelectionArea(globalSelectionAreaContainer!);
        expect(selectedAreaNative.style.left).toEqual('0px');
        expect(selectedAreaNative.style.width).toEqual('100px');

        // move the mouse over the edge of the origin
        dispatchMouseEvent(window, 'mousemove', 420, 10);
        flush();
        tickRequestAnimationFrame();
        selectedAreaNative = getSelectionArea(globalSelectionAreaContainer!);
        expect(selectedAreaNative.style.left).toEqual('300px');
        expect(selectedAreaNative.style.width).toEqual('100px');
      }));
    });

    describe('on the left handle', () => {
      let handleNative: HTMLElement;
      beforeEach(fakeAsync(() => {
        selectedAreaNative = getSelectionArea(globalSelectionAreaContainer!);
        handleNative = getLeftHandle(selectedAreaNative);

        // selectedArea position after this creation inside the host
        // left 100
        // width 100
        //     selectedArea
        //  | ----- |
        // 100     200
      }));

      it('should move the handle 25px to the left', fakeAsync(() => {
        dispatchMouseEvent(handleNative, 'mousedown', 110, 10);
        fixture.detectChanges();
        flush();
        tickRequestAnimationFrame();
        dispatchMouseEvent(window, 'mousemove', 85, 10);
        flush();
        tickRequestAnimationFrame();
        selectedAreaNative = getSelectionArea(globalSelectionAreaContainer!);
        expect(selectedAreaNative.style.left).toEqual('75px');
        expect(selectedAreaNative.style.width).toEqual('125px');
      }));

      it('should move the handle 50px to the right but not over the right handle', fakeAsync(() => {
        dispatchMouseEvent(handleNative, 'mousedown', 110, 10);
        fixture.detectChanges();
        flush();
        tickRequestAnimationFrame();
        dispatchMouseEvent(window, 'mousemove', 160, 10);
        flush();
        tickRequestAnimationFrame();
        selectedAreaNative = getSelectionArea(globalSelectionAreaContainer!);
        expect(selectedAreaNative.style.left).toEqual('150px');
        expect(selectedAreaNative.style.width).toEqual('50px');
      }));

      it('should move the handle 150px to the right so over the right handle', fakeAsync(() => {
        dispatchMouseEvent(handleNative, 'mousedown', 110, 10);
        fixture.detectChanges();
        flush();
        tickRequestAnimationFrame();
        dispatchMouseEvent(window, 'mousemove', 260, 10);
        flush();
        tickRequestAnimationFrame();
        selectedAreaNative = getSelectionArea(globalSelectionAreaContainer!);
        expect(selectedAreaNative.style.left).toEqual('200px');
        expect(selectedAreaNative.style.width).toEqual('100px');
      }));
    });

    describe('on the right handle', () => {
      let handleNative: HTMLElement;
      beforeEach(fakeAsync(() => {
        selectedAreaNative = getSelectionArea(globalSelectionAreaContainer!);
        handleNative = getRightHandle(selectedAreaNative);

        // selectedArea position after this creation inside the host
        // left 100
        // width 100
        //     selectedArea
        //  | ----- |
        // 100     200
      }));

      it('should move the handle 50px to the right', fakeAsync(() => {
        dispatchMouseEvent(handleNative, 'mousedown', 210, 10);
        fixture.detectChanges();
        flush();
        tickRequestAnimationFrame();
        dispatchMouseEvent(window, 'mousemove', 260, 10);
        flush();
        tickRequestAnimationFrame();
        selectedAreaNative = getSelectionArea(globalSelectionAreaContainer!);
        expect(selectedAreaNative.style.left).toEqual('100px');
        expect(selectedAreaNative.style.width).toEqual('150px');
      }));

      it('should move the handle 50 to the left but not over the left handle', fakeAsync(() => {
        dispatchMouseEvent(handleNative, 'mousedown', 210, 10);
        fixture.detectChanges();
        flush();
        tickRequestAnimationFrame();
        dispatchMouseEvent(window, 'mousemove', 160, 10);
        flush();
        tickRequestAnimationFrame();
        selectedAreaNative = getSelectionArea(globalSelectionAreaContainer!);
        expect(selectedAreaNative.style.left).toEqual('100px');
        expect(selectedAreaNative.style.width).toEqual('50px');
      }));

      it('should move the handle 150 to the left, so over the left handle', fakeAsync(() => {
        dispatchMouseEvent(handleNative, 'mousedown', 210, 10);
        fixture.detectChanges();
        flush();
        tickRequestAnimationFrame();
        dispatchMouseEvent(window, 'mousemove', 60, 10);
        flush();
        tickRequestAnimationFrame();
        selectedAreaNative = getSelectionArea(globalSelectionAreaContainer!);
        expect(selectedAreaNative.style.left).toEqual('50px');
        expect(selectedAreaNative.style.width).toEqual('50px');
      }));
    });
  });

  describe('keyboard interaction', () => {
    let fixture: ComponentFixture<BasicTest>;
    let origin: HTMLElement;
    let selectedAreaNative: HTMLElement;
    let globalSelectionAreaContainer: HTMLElement | null;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(BasicTest);
      globalSelectionAreaContainer = getGlobalSelectionAreaHost();
      origin = fixture.componentInstance.origin.nativeElement;
      zone.simulateZoneExit();
      dispatchKeyboardEvent(origin, 'keydown', ENTER);
      flush();
      fixture.detectChanges();
      selectedAreaNative = getSelectionArea(globalSelectionAreaContainer!);
    }));

    it('should create the selectedArea on ENTER', () => {
      expect(selectedAreaNative.style.left).toEqual('100px');
      expect(selectedAreaNative.style.width).toEqual('200px');
    });

    it('should fire the change event once on ENTER', fakeAsync(() => {
      fixture.detectChanges();
      expect(fixture.componentInstance.counter).toEqual(1);
    }));

    describe('on the selectedArea', () => {
      it('should move the selectedArea to the left when LEFT_ARROW or UP_ARROW is pressed', fakeAsync(() => {
        dispatchKeyboardEvent(selectedAreaNative, 'keydown', LEFT_ARROW);
        flush();
        expect(selectedAreaNative.style.left).toEqual('99px');

        dispatchKeyboardEvent(selectedAreaNative, 'keydown', UP_ARROW);
        flush();
        expect(selectedAreaNative.style.left).toEqual('98px');
      }));

      it('should move the selectedArea to the right when DOWN_ARROW or RIGHT_ARROW is pressed', fakeAsync(() => {
        dispatchKeyboardEvent(selectedAreaNative, 'keydown', RIGHT_ARROW);
        flush();
        expect(selectedAreaNative.style.left).toEqual('101px');

        dispatchKeyboardEvent(selectedAreaNative, 'keydown', DOWN_ARROW);
        flush();
        expect(selectedAreaNative.style.left).toEqual('102px');
      }));

      it('should move the selectedArea 10px to the left when PAGE_UP is pressed', fakeAsync(() => {
        dispatchKeyboardEvent(selectedAreaNative, 'keydown', PAGE_UP);
        flush();
        expect(selectedAreaNative.style.left).toEqual('90px');
      }));

      it('should move the selectedArea 10px to the left when PAGE_DOWN is pressed', fakeAsync(() => {
        dispatchKeyboardEvent(selectedAreaNative, 'keydown', PAGE_DOWN);
        flush();
        expect(selectedAreaNative.style.left).toEqual('110px');
      }));

      it('should move the selectedArea to start when HOME is pressed', fakeAsync(() => {
        dispatchKeyboardEvent(selectedAreaNative, 'keydown', HOME);
        flush();
        expect(selectedAreaNative.style.left).toEqual('0px');
      }));

      it('should move the selectedArea to end when END is pressed', fakeAsync(() => {
        dispatchKeyboardEvent(selectedAreaNative, 'keydown', END);
        flush();
        expect(selectedAreaNative.style.left).toEqual('200px');
        expect(selectedAreaNative.style.width).toEqual('200px');
      }));
    });

    describe('on the left-handle', () => {
      let leftHandle;

      beforeEach(() => {
        leftHandle = getSelectionArea(
          globalSelectionAreaContainer!,
        ).querySelector<HTMLButtonElement>('.dt-selection-area-left-handle')!;
      });

      it('should move it to the left when LEFT_ARROW or UP_ARROW is pressed', fakeAsync(() => {
        dispatchKeyboardEvent(leftHandle, 'keydown', LEFT_ARROW);
        flush();
        expect(selectedAreaNative.style.left).toEqual('99px');
        expect(selectedAreaNative.style.width).toEqual('201px');

        dispatchKeyboardEvent(leftHandle, 'keydown', UP_ARROW);
        flush();
        expect(selectedAreaNative.style.left).toEqual('98px');
        expect(selectedAreaNative.style.width).toEqual('202px');
      }));

      it('should move it to the right when DOWN_ARROW or RIGHT_ARROW is pressed', fakeAsync(() => {
        dispatchKeyboardEvent(leftHandle, 'keydown', RIGHT_ARROW);
        flush();
        expect(selectedAreaNative.style.left).toEqual('101px');
        expect(selectedAreaNative.style.width).toEqual('199px');

        dispatchKeyboardEvent(leftHandle, 'keydown', DOWN_ARROW);
        flush();
        expect(selectedAreaNative.style.left).toEqual('102px');
        expect(selectedAreaNative.style.width).toEqual('198px');
      }));

      it('should move it 10px to the left when PAGE_UP is pressed', fakeAsync(() => {
        dispatchKeyboardEvent(leftHandle, 'keydown', PAGE_UP);
        flush();
        expect(selectedAreaNative.style.left).toEqual('90px');
        expect(selectedAreaNative.style.width).toEqual('210px');
      }));

      it('should move the selectedArea 10px to the left when PAGE_DOWN is pressed', fakeAsync(() => {
        dispatchKeyboardEvent(leftHandle, 'keydown', PAGE_DOWN);
        flush();
        expect(selectedAreaNative.style.left).toEqual('110px');
        expect(selectedAreaNative.style.width).toEqual('190px');
      }));

      it('should move the selectedArea to start when HOME is pressed', fakeAsync(() => {
        dispatchKeyboardEvent(leftHandle, 'keydown', HOME);
        flush();
        expect(selectedAreaNative.style.left).toEqual('0px');
        expect(selectedAreaNative.style.width).toEqual('300px');
      }));

      it('should move the selectedArea to end when END is pressed', fakeAsync(() => {
        dispatchKeyboardEvent(leftHandle, 'keydown', END);
        flush();
        expect(selectedAreaNative.style.left).toEqual('300px');
        expect(selectedAreaNative.style.width).toEqual('100px');
      }));
    });

    describe('on the right-handle', () => {
      let rightHandle;

      beforeEach(() => {
        rightHandle = getSelectionArea(
          globalSelectionAreaContainer!,
        ).querySelector<HTMLButtonElement>('.dt-selection-area-right-handle')!;
      });

      it('should move it to the left when LEFT_ARROW or UP_ARROW is pressed', fakeAsync(() => {
        dispatchKeyboardEvent(rightHandle, 'keydown', LEFT_ARROW);
        flush();
        expect(selectedAreaNative.style.left).toEqual('100px');
        expect(selectedAreaNative.style.width).toEqual('199px');

        dispatchKeyboardEvent(rightHandle, 'keydown', UP_ARROW);
        flush();
        expect(selectedAreaNative.style.left).toEqual('100px');
        expect(selectedAreaNative.style.width).toEqual('198px');
      }));

      it('should move it to the right when DOWN_ARROW or RIGHT_ARROW is pressed', fakeAsync(() => {
        dispatchKeyboardEvent(rightHandle, 'keydown', RIGHT_ARROW);
        flush();
        expect(selectedAreaNative.style.left).toEqual('100px');
        expect(selectedAreaNative.style.width).toEqual('201px');

        dispatchKeyboardEvent(rightHandle, 'keydown', DOWN_ARROW);
        flush();
        expect(selectedAreaNative.style.left).toEqual('100px');
        expect(selectedAreaNative.style.width).toEqual('202px');
      }));

      it('should move it 10px to the left when PAGE_UP is pressed', fakeAsync(() => {
        dispatchKeyboardEvent(rightHandle, 'keydown', PAGE_UP);
        flush();
        expect(selectedAreaNative.style.left).toEqual('100px');
        expect(selectedAreaNative.style.width).toEqual('190px');
      }));

      it('should move the selected area 10px to the left when PAGE_DOWN is pressed', fakeAsync(() => {
        dispatchKeyboardEvent(rightHandle, 'keydown', PAGE_DOWN);
        flush();
        expect(selectedAreaNative.style.left).toEqual('100px');
        expect(selectedAreaNative.style.width).toEqual('210px');
      }));

      it('should move the selected area to start when HOME is pressed', fakeAsync(() => {
        dispatchKeyboardEvent(rightHandle, 'keydown', HOME);
        flush();
        expect(selectedAreaNative.style.left).toEqual('0px');
        expect(selectedAreaNative.style.width).toEqual('100px');
      }));

      it('should move the selected area to start when END is pressed', fakeAsync(() => {
        dispatchKeyboardEvent(rightHandle, 'keydown', END);
        flush();
        expect(selectedAreaNative.style.left).toEqual('100px');
        expect(selectedAreaNative.style.width).toEqual('300px');
      }));
    });
  });

  describe('overlay', () => {
    let fixture: ComponentFixture<BasicTest>;
    let origin: HTMLElement;
    let selectedArea: HTMLElement;
    let closeButton: HTMLButtonElement | null;
    let globalSelectionAreaContainer: HTMLElement | null;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(BasicTest);
      globalSelectionAreaContainer = getGlobalSelectionAreaHost();
      zone.simulateZoneExit();
      origin = fixture.componentInstance.origin.nativeElement;
      dispatchMouseEvent(origin, 'mousedown', 100, 10);
      fixture.detectChanges();
      flush();
      tickRequestAnimationFrame();

      dispatchMouseEvent(window, 'mousemove', 200, 10);
      flush();
      tickRequestAnimationFrame();

      dispatchMouseEvent(window, 'mouseup');

      fixture.detectChanges();
      selectedArea = getSelectionArea(globalSelectionAreaContainer!);
      closeButton = overlayContainerElement.querySelector(
        '.dt-selection-area-close button',
      );
    }));

    it('should be dismissed and hidden when closed', fakeAsync(() => {
      expect(closeButton).not.toBeNull();
      closeButton!.click();
      fixture.detectChanges();
      tick();
      expect(
        overlayContainerElement.querySelector(
          '.dt-selection-area-overlay-pane',
        ),
      ).toBeNull();
      expect(selectedArea.style.visibility).toBe('hidden');
    }));

    it('should fire a closed event when closing by clicking the button', fakeAsync(() => {
      const selectionArea = fixture.debugElement.query(
        By.directive(DtSelectionArea),
      ).componentInstance;
      const closeSpy = jest.fn();

      selectionArea.closed.subscribe(closeSpy);
      zone.simulateZoneExit();
      expect(closeSpy).not.toHaveBeenCalled();
      closeButton!.click();
      fixture.detectChanges();
      expect(closeSpy).toHaveBeenCalledTimes(1);
    }));

    it('should fire a closed event when closing programmatically', fakeAsync(() => {
      const selectionArea: DtSelectionArea = fixture.debugElement.query(
        By.directive(DtSelectionArea),
      ).componentInstance;
      const closeSpy = jest.fn();

      selectionArea.closed.subscribe(closeSpy);
      zone.simulateZoneExit();
      expect(closeSpy).not.toHaveBeenCalled();
      selectionArea.close();
      fixture.detectChanges();
      expect(closeSpy).toHaveBeenCalledTimes(1);
    }));
  });

  describe('a11y', () => {
    let fixture: ComponentFixture<BasicTest>;
    let origin: HTMLElement;
    let selectedArea: HTMLElement;
    let closeButton: HTMLButtonElement | null;
    let globalSelectionAreaContainer: HTMLElement | null;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(BasicTest);
      globalSelectionAreaContainer = getGlobalSelectionAreaHost();
      zone.simulateZoneExit();
      origin = fixture.componentInstance.origin.nativeElement;
      dispatchMouseEvent(origin, 'mousedown', 110, 10);
      fixture.detectChanges();
      flush();
      tickRequestAnimationFrame();

      dispatchMouseEvent(window, 'mousemove', 210, 10);
      flush();
      tickRequestAnimationFrame();

      dispatchMouseEvent(window, 'mouseup');

      fixture.detectChanges();
      selectedArea = getSelectionArea(globalSelectionAreaContainer!);
      closeButton = overlayContainerElement.querySelector(
        '.dt-selection-area-close button',
      );
    }));

    it('should set the aria-label on the selected-area', () => {
      expect(selectedArea.getAttribute('aria-label')).toBe(
        'aria selected-area',
      );
    });

    it('should set the aria-label on the left handle', () => {
      const handle = getLeftHandle(selectedArea);
      expect(handle.getAttribute('aria-label')).toBe('aria left');
    });

    it('should set the aria-label on the right handle', () => {
      const handle = getRightHandle(selectedArea);
      expect(handle.getAttribute('aria-label')).toBe('aria right');
    });

    it('should set the aria-label on the close button', () => {
      expect(closeButton!.getAttribute('aria-label')).toBe('aria close');
    });

    it('should have the role slider', () => {
      const left = getLeftHandle(selectedArea);
      const right = getRightHandle(selectedArea);
      expect(selectedArea.getAttribute('aria-role')).toBe('slider');
      expect(left.getAttribute('aria-role')).toBe('slider');
      expect(right.getAttribute('aria-role')).toBe('slider');
    });

    it('should have the correct values for valuemin valuemax valuenow on the left handle', () => {
      const left = getLeftHandle(selectedArea);
      expect(left.getAttribute('aria-valuemin')).toBe('0');
      expect(left.getAttribute('aria-valuemax')).toBe('200');
      expect(left.getAttribute('aria-valuenow')).toBe('100');
    });

    it('should have the correct values for valuemin valuemax valuenow on the right handle', () => {
      const right = getRightHandle(selectedArea);
      expect(right.getAttribute('aria-valuemin')).toBe('100');
      expect(right.getAttribute('aria-valuemax')).toBe('400');
      expect(right.getAttribute('aria-valuenow')).toBe('200');
    });
  });

  describe('origin being a chart', () => {
    let fixture: ComponentFixture<ChartTest>;

    it('should throw an error when the axis is not a datetime axis', fakeAsync(() => {
      expect(() => {
        fixture = createComponent(ChartTest);
      }).not.toThrowError();

      expect(() => {
        fixture.componentInstance.chart.fakeDateTimeAxis();
        fixture.detectChanges();
        fixture.componentInstance.chart._afterRender.next();
        flush();
      }).toThrowError(
        wrappedErrorMessage(getDtChartSelectionAreaDateTimeAxisError()),
      );
    }));
  });

  describe('globalContainer', () => {
    it('should render the selection-area-container component inside the globalcontainer', () => {
      createComponent(ProjectedTest);
      const globalContainer = getGlobalSelectionAreaHost();
      expect(globalContainer).toBeDefined();
      expect(
        globalContainer!.querySelector('dt-selection-area-container'),
      ).not.toBeNull();
    });
  });
});

function getGlobalSelectionAreaHost(): HTMLElement | null {
  return document.body.querySelector('.dt-selection-area-global-container');
}

function getSelectionArea(
  globalSelectionAreaContainer: HTMLElement,
): HTMLElement {
  return globalSelectionAreaContainer.querySelector<HTMLElement>(
    '.dt-selection-area-selected-area',
  )!;
}

function getLeftHandle(selectionArea: HTMLElement): HTMLElement {
  return selectionArea.querySelector<HTMLButtonElement>(
    '.dt-selection-area-left-handle',
  )!;
}

function getRightHandle(selectionArea: HTMLElement): HTMLElement {
  return selectionArea.querySelector<HTMLButtonElement>(
    '.dt-selection-area-right-handle',
  )!;
}

@Component({
  template: `
    <div class="origin" #origin [dtSelectionArea]="area"></div>
    <dt-selection-area
      #area="dtSelectionArea"
      aria-label-selected-area="aria selected-area"
      aria-label-left-handle="aria left"
      aria-label-right-handle="aria right"
      aria-label-close-button="aria close"
      (changed)="handleChange($event)"
    >
      Some basic overlay content
      <dt-selection-area-actions>
        <button dt-button>Zoom in</button>
      </dt-selection-area-actions>
    </dt-selection-area>
  `,
  styles: [
    'body { margin: 10px; }',
    '.origin { width: 400px; height: 400px; }',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class BasicTest {
  @ViewChild('origin', { static: true }) origin: ElementRef;
  @ViewChild(DtSelectionArea, { static: true }) selectionArea: DtSelectionArea;
  counter = 0;

  handleChange(): void {
    this.counter += 1;
  }
}

@Component({
  template: `
    <div class="origin" #origin [dtSelectionArea]="area" tabindex="10"></div>
    <dt-selection-area #area="dtSelectionArea">
      Some basic overlay content
    </dt-selection-area>
  `,
})
export class BasicTestWithInitialTabIndex {
  @ViewChild('origin', { static: true }) origin: ElementRef;
}

@Component({
  template: `
    <dt-card>
      <div class="origin" [dtSelectionArea]="area" tabindex="10"></div>
      <dt-selection-area #area="dtSelectionArea">
        Some basic overlay content
      </dt-selection-area>
    </dt-card>
  `,
})
export class ProjectedTest {}

/** Test component that fakes a dt-chart so we can test without highcharts */
@Component({
  selector: 'dt-chart',
  template: `
    <div #container>
      <svg [attr.width]="width" height="250" [attr.viewBox]="viewbox">
        <svg:rect
          class="highcharts-plot-background"
          [attr.x]="x"
          y="16"
          [attr.width]="plotWidth"
          height="200"
        ></svg:rect>
      </svg>
    </div>
  `,
  providers: [{ provide: DtChart, useExisting: DummyChart }],
})
class DummyChart implements AfterViewInit, OnDestroy {
  _afterRender = new Subject<boolean>();
  _chartObject = {
    xAxis: [
      {
        isDatetimeAxis: true,
      },
    ],
  };

  @ViewChild('container', { static: true }) container;

  options: any;

  ngAfterViewInit(): void {
    this._afterRender.next(true);
  }

  ngOnDestroy(): void {
    this._afterRender.complete();
  }

  fakeDateTimeAxis(): void {
    this._chartObject.xAxis[0].isDatetimeAxis = false;
  }
}

@Component({
  template: `
    <dt-chart #origin [dtChartSelectionArea]="area"></dt-chart>
    <dt-selection-area #area="dtSelectionArea">
      Some basic overlay content
    </dt-selection-area>
  `,
})
export class ChartTest {
  @ViewChild('origin', { static: true }) origin: ElementRef;
  @ViewChild('origin', { static: true }) chart: DummyChart;
}
