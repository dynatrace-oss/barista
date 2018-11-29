import { async, TestBed, fakeAsync, flush, ComponentFixture, tick } from '@angular/core/testing';
import { DtSelectionAreaModule, DtIconModule } from '@dynatrace/angular-components';
import { Component, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { DtButtonModule } from '../button';
import { dispatchMouseEvent } from '../../testing/dispatch-events';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DtSelectionArea } from './selection-area';
import { tickRequestAnimationFrame } from '../../testing/request-animation-frame';

fdescribe('DtSelectionArea', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DtSelectionAreaModule,
        DtButtonModule,
        HttpClientTestingModule,
        DtIconModule.forRoot({svgIconLocation: `{{name}}.svg`}),
      ],
      declarations: [
        BasicTest,
        BasicTestWithInitialTabIndex,
      ],
    });

    TestBed.compileComponents();
  }));

  describe('origin', () => {
    it('should make the origin tabable when a selection area is attached and the element has no tabindex', () => {
      const fixture = TestBed.createComponent(BasicTest);
      fixture.detectChanges();
      const origin = fixture.componentInstance.origin;
      expect(origin.nativeElement.getAttribute('tabindex')).toBeDefined();
    });
    it('should not change the tabindex on the origin if it was already', () => {
      const fixture = TestBed.createComponent(BasicTestWithInitialTabIndex);
      fixture.detectChanges();
      const origin = fixture.componentInstance.origin;
      expect(origin.nativeElement.getAttribute('tabindex')).toBe('10');
    });
    it('should position the selection-area over to the origin', () => {
      const fixture = TestBed.createComponent(BasicTest);
      fixture.detectChanges();
      const origin = fixture.componentInstance.origin;
      const originDomRect = origin.nativeElement.getBoundingClientRect();
      const selectionArea = fixture.debugElement.query(By.directive(DtSelectionArea)).nativeElement;
      expect(selectionArea.style.left).toEqual(`${originDomRect.left}px`);
      expect(selectionArea.style.top).toEqual(`${originDomRect.top}px`);
      expect(selectionArea.style.width).toEqual(`${originDomRect.width}px`);
      expect(selectionArea.style.height).toEqual(`${originDomRect.height}px`);
    });
  });

  describe('mouse interaction', () => {
    let fixture: ComponentFixture<any>;
    let origin: HTMLElement;
    let originMargin: number;
    let originWidth: number;

    beforeEach(() => {
      fixture = TestBed.createComponent(BasicTest);
      fixture.detectChanges();
      origin = fixture.componentInstance.origin.nativeElement;
      originMargin = origin.getBoundingClientRect().left;
      originWidth = origin.getBoundingClientRect().width;
    });

    describe('creation', () => {
      it('should create the selection area at the mouseposition', fakeAsync(() => {
        dispatchMouseEvent(origin, 'mousedown', 10, 10);
        fixture.detectChanges();
        flush();
        tickRequestAnimationFrame();
        const box = fixture.debugElement.query(By.css('.dt-selection-area-box'));
        expect(box.nativeElement.style.left).toEqual(`${10 - originMargin}px`);
      }));

      it('should scale the selection area on mousemove', fakeAsync(() => {
        dispatchMouseEvent(origin, 'mousedown', 10, 10);
        fixture.detectChanges();
        flush();
        tickRequestAnimationFrame();

        dispatchMouseEvent(window, 'mousemove', 20, 10);
        flush();
        tickRequestAnimationFrame();
        const box = fixture.debugElement.query(By.css('.dt-selection-area-box'));
        expect(box.nativeElement.style.left).toEqual(`${10 - originMargin}px`);
        expect(box.nativeElement.style.width).toEqual('10px');
      }));

      it('should scale the selection area correctly when the mouse is moved to the left of the creation point', fakeAsync(() => {
        dispatchMouseEvent(origin, 'mousedown', 20, 10);
        fixture.detectChanges();
        flush();
        tickRequestAnimationFrame();

        dispatchMouseEvent(window, 'mousemove', 10, 10);
        flush();
        tickRequestAnimationFrame();
        const box = fixture.debugElement.query(By.css('.dt-selection-area-box'));
        expect(box.nativeElement.style.right).toEqual(`${originWidth + originMargin - 20}px`);
        expect(box.nativeElement.style.width).toEqual('10px');
      }));

      it('should scale the selection area correctly when the mouse is moved to the left and then to the right', fakeAsync(() => {
        dispatchMouseEvent(origin, 'mousedown', 20, 10);
        fixture.detectChanges();
        flush();
        tickRequestAnimationFrame();

        dispatchMouseEvent(window, 'mousemove', 10, 10);
        flush();
        tickRequestAnimationFrame();

        dispatchMouseEvent(window, 'mousemove', 30, 10);
        flush();
        tickRequestAnimationFrame();
        const box = fixture.debugElement.query(By.css('.dt-selection-area-box'));
        expect(box.nativeElement.style.left).toEqual(`${20 - originMargin}px`);
        expect(box.nativeElement.style.width).toEqual('10px');
      }));

      it('should constrain the position to the origin\'s left edge', fakeAsync(() => {
        dispatchMouseEvent(origin, 'mousedown', 20, 10);
        fixture.detectChanges();
        flush();
        tickRequestAnimationFrame();

        dispatchMouseEvent(window, 'mousemove', 0, 10);
        flush();
        tickRequestAnimationFrame();
        const box = fixture.debugElement.query(By.css('.dt-selection-area-box'));
        expect(box.nativeElement.style.right).toEqual(`${originWidth + originMargin - 20}px`);
        expect(box.nativeElement.style.width).toEqual('10px');
      }));

      it('should constrain the position to the origin\'s right edge', fakeAsync(() => {
        dispatchMouseEvent(origin, 'mousedown', 20, 10);
        fixture.detectChanges();
        flush();
        tickRequestAnimationFrame();

        dispatchMouseEvent(window, 'mousemove', 420, 10);
        flush();
        tickRequestAnimationFrame();
        const box = fixture.debugElement.query(By.css('.dt-selection-area-box'));
        expect(box.nativeElement.style.left).toEqual('10px');
        expect(box.nativeElement.style.width).toEqual('390px');
      }));
    });

    describe('moving the box', () => {
      beforeEach(fakeAsync(() => {
        dispatchMouseEvent(origin, 'mousedown', 10, 10);
        fixture.detectChanges();
        flush();
        tickRequestAnimationFrame();

        dispatchMouseEvent(window, 'mousemove', 20, 10);
        flush();
        tickRequestAnimationFrame();
        dispatchMouseEvent(window, 'mouseup');
        flush();
        tickRequestAnimationFrame();

        // position after this creation ignorign the margin
        // left 10
        // width 10
      }));

      it('should move the box to the right', fakeAsync(() => {
        let boxNative = fixture.debugElement.query(By.css('.dt-selection-area-box')).nativeElement;
        // mousedown on the box
        dispatchMouseEvent(boxNative, 'mousedown', 15, 10);
        fixture.detectChanges();
        flush();
        tickRequestAnimationFrame();
        // move box 10 px to the right
        dispatchMouseEvent(window, 'mousemove', 25, 10);
        flush();
        tickRequestAnimationFrame();
        boxNative = fixture.debugElement.query(By.css('.dt-selection-area-box')).nativeElement;
        // since start is 10 it should now be 20
        expect(boxNative.style.left).toEqual(`${20 - originMargin}px`);
        expect(boxNative.style.width).toEqual('10px');
      }));

      it('should move the box to the left', fakeAsync(() => {
        let boxNative = fixture.debugElement.query(By.css('.dt-selection-area-box')).nativeElement;
        // mousedown on the box
        dispatchMouseEvent(boxNative, 'mousedown', 15, 10);
        fixture.detectChanges();
        flush();
        tickRequestAnimationFrame();
        // move box 10 px to the right
        dispatchMouseEvent(window, 'mousemove', 5, 10);
        flush();
        tickRequestAnimationFrame();
        boxNative = fixture.debugElement.query(By.css('.dt-selection-area-box')).nativeElement;
        // since start is 10 it should now be 20
        expect(boxNative.style.left).toEqual('0px');
        expect(boxNative.style.width).toEqual('10px');
      }));

      it('should constrain the box to the origin', fakeAsync(() => {
        let boxNative = fixture.debugElement.query(By.css('.dt-selection-area-box')).nativeElement;
        // mousedown on the box
        dispatchMouseEvent(boxNative, 'mousedown', 15, 10);
        fixture.detectChanges();
        flush();
        tickRequestAnimationFrame();
        // move box 10 px to the right
        dispatchMouseEvent(window, 'mousemove', 0, 10);
        flush();
        tickRequestAnimationFrame();
        boxNative = fixture.debugElement.query(By.css('.dt-selection-area-box')).nativeElement;
        // since start is 10 it should now be 20
        expect(boxNative.style.left).toEqual('0px');
        expect(boxNative.style.width).toEqual('10px');

        dispatchMouseEvent(window, 'mousemove', 420, 10);
        flush();
        tickRequestAnimationFrame();
        boxNative = fixture.debugElement.query(By.css('.dt-selection-area-box')).nativeElement;
        // since start is 10 it should now be 20
        expect(boxNative.style.left).toEqual(`${400 - originMargin}px`);
        expect(boxNative.style.width).toEqual('10px');
      }));
    });
  });
});

@Component({
  template: `
  <div class="origin" #origin></div>
  <dt-selection-area [origin]="origin">
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
  @ViewChild('origin') origin: ElementRef;
}

@Component({
  template: `
  <div class="origin" #origin tabindex="10"></div>
  <dt-selection-area [origin]="origin">
    Some basic overlay content 
  </dt-selection-area>
  `,
})
export class BasicTestWithInitialTabIndex {
  @ViewChild('origin') origin: ElementRef;
}
