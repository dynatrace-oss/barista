
import {ComponentFixture, TestBed, fakeAsync, inject, flush} from '@angular/core/testing';
import { Component } from '@angular/core';
import { DtOverlayModule, DtOverlayConfig } from '@dynatrace/angular-components';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';
import { dispatchMouseEvent } from '../../testing/dispatch-events';
import { By } from '@angular/platform-browser';

describe('DtOverlayTrigger', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let trigger: HTMLElement;

  let fixture: ComponentFixture<TestComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [DtOverlayModule, NoopAnimationsModule],
      declarations: [TestComponent],
    }).compileComponents();
  }));

  beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
    overlayContainer = oc;
    overlayContainerElement = oc.getContainerElement();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    trigger = fixture.debugElement.query(By.css('.dt-overlay-trigger')).nativeElement;
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should create an overlay on mouseover and close on mouseout', fakeAsync(() => {
    dispatchMouseEvent(trigger, 'mouseover');
    fixture.detectChanges();

    let overlay = overlayContainerElement.querySelector('.dt-overlay-container') as HTMLElement;
    expect(overlay).toBeDefined();
    expect(overlay.innerText).toEqual('overlay');

    dispatchMouseEvent(trigger, 'mouseout');
    fixture.detectChanges();
    flush();

    overlay = overlayContainerElement.querySelector('.dt-overlay-container') as HTMLElement;
    expect(overlay).toBeNull();
  }));

  it('should not be pinnable by default', fakeAsync(() => {
    dispatchMouseEvent(trigger, 'mouseover');
    fixture.detectChanges();

    dispatchMouseEvent(trigger, 'click');
    fixture.detectChanges();
    flush();

    dispatchMouseEvent(trigger, 'mouseout');
    flush();

    const overlay = overlayContainerElement.querySelector('.dt-overlay-container') as HTMLElement;
    expect(overlay).toBeNull();
  }));

  it('should be pinnable if configured', fakeAsync(() => {
    fixture.componentInstance.config = { pinnable: true };
    fixture.detectChanges();
    dispatchMouseEvent(trigger, 'mouseover');
    fixture.detectChanges();

    dispatchMouseEvent(trigger, 'click');
    fixture.detectChanges();
    flush();

    dispatchMouseEvent(trigger, 'mouseout');
    flush();

    const overlay = overlayContainerElement.querySelector('.dt-overlay-container') as HTMLElement;
    expect(overlay).not.toBeNull();
  }));

  // it('should set the offset to the mouseposition', fakeAsync(() => {
  //   const offset = 10;
  //   dispatchMouseEvent(trigger, 'mouseover');
  //   flush();
  //   dispatchMouseEvent(
  //     trigger,
  //     'mousemove',
  //     trigger.getBoundingClientRect().left + offset,
  //     trigger.getBoundingClientRect().top + offset);
  //   fixture.detectChanges();
  //   flush();

  //   const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
  //   expect(overlayPane).toBeDefined();
  //   expect(overlayPane.style.transform).toEqual(
  //     `translateX(${offset}px) translateY(${offset}px)`
  //   );
  // }));

});

/** dummy component */
@Component({
  selector: 'dt-test-component',
  template: '<div [dtOverlay]="overlay" [dtOverlayConfig]="config">trigger</div><ng-template #overlay>overlay</ng-template>',
})
class TestComponent {
  config: DtOverlayConfig = {};
}
