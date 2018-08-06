
import {ComponentFixture, TestBed, fakeAsync, inject, flush} from '@angular/core/testing';
import { Component } from '@angular/core';
import { DtOverlayModule, DtOverlayConfig, DT_OVERLAY_DEFAULT_OFFSET } from '@dynatrace/angular-components';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';
import { dispatchMouseEvent, dispatchKeyboardEvent } from '../../testing/dispatch-events';
import { By } from '@angular/platform-browser';
import { SPACE, ENTER, ESCAPE } from '@angular/cdk/keycodes';

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

  it('should create an overlay on mouseover and dismiss on mouseout', fakeAsync(() => {
    dispatchMouseEvent(trigger, 'mouseover');
    fixture.detectChanges();

    let overlay = getContainerElement(overlayContainerElement);
    expect(overlay).toBeDefined();
    expect(overlay.innerText).toEqual('overlay');

    dispatchMouseEvent(trigger, 'mouseout');
    fixture.detectChanges();
    flush();

    overlay = getContainerElement(overlayContainerElement);
    expect(overlay).toBeNull();
  }));

  it('should set the offset to the mouseposition and deal with initial offset', fakeAsync(() => {
    const offset = 1;
    dispatchMouseEvent(trigger, 'mouseover');
    flush();
    dispatchMouseEvent(
      trigger,
      'mousemove',
      trigger.getBoundingClientRect().left + offset,
      trigger.getBoundingClientRect().top + offset);
    fixture.detectChanges();
    flush();

    const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
    expect(overlayPane).toBeDefined();
    expect(overlayPane.style.transform).toEqual(
      `translateX(${DT_OVERLAY_DEFAULT_OFFSET + 1}px) translateY(${DT_OVERLAY_DEFAULT_OFFSET + offset}px)`
    );
  }));

  it('should not be pinnable by default', fakeAsync(() => {
    dispatchMouseEvent(trigger, 'mouseover');
    fixture.detectChanges();

    dispatchMouseEvent(trigger, 'click');
    fixture.detectChanges();
    flush();

    dispatchMouseEvent(trigger, 'mouseout');
    flush();

    const overlay = getContainerElement(overlayContainerElement);
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

    const overlay = getContainerElement(overlayContainerElement);
    expect(overlay).not.toBeNull();
  }));

  it('should lock movement to xAxis', fakeAsync(() => {
    const offset = 1;
    fixture.componentInstance.config = { movementConstraint: 'xAxis' };
    fixture.detectChanges();
    dispatchMouseEvent(trigger, 'mouseover');
    flush();
    dispatchMouseEvent(
      trigger,
      'mousemove',
      trigger.getBoundingClientRect().left + offset,
      trigger.getBoundingClientRect().top + offset);
    fixture.detectChanges();
    flush();

    const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
    expect(overlayPane.style.transform).toEqual(
      `translateX(${DT_OVERLAY_DEFAULT_OFFSET + offset}px) translateY(${DT_OVERLAY_DEFAULT_OFFSET}px)`
    );
  }));

  it('should lock movement to yAxis', fakeAsync(() => {
    const offset = 1;
    fixture.componentInstance.config = { movementConstraint: 'yAxis' };
    fixture.detectChanges();
    dispatchMouseEvent(trigger, 'mouseover');
    flush();
    dispatchMouseEvent(
      trigger,
      'mousemove',
      trigger.getBoundingClientRect().left + offset,
      trigger.getBoundingClientRect().top + offset);
    fixture.detectChanges();
    flush();

    const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
    expect(overlayPane.style.transform).toEqual(
      `translateX(${DT_OVERLAY_DEFAULT_OFFSET}px) translateY(${DT_OVERLAY_DEFAULT_OFFSET + offset}px)`
    );
  }));

  it('should focus the trigger', () => {
    expect(document.activeElement).not.toBe(trigger);

    trigger.focus();
    fixture.detectChanges();

    expect(document.activeElement).toBe(trigger);
  });

  it('should open the overlay with space', () => {
    dispatchKeyboardEvent(trigger, 'keydown', SPACE);
    fixture.detectChanges();
    const overlay = getContainerElement(overlayContainerElement);

    expect(overlay).not.toBeNull();
  });

  it('should open the overlay with enter', () => {
    dispatchKeyboardEvent(trigger, 'keydown', ENTER);
    fixture.detectChanges();
    const overlay = getContainerElement(overlayContainerElement);

    expect(overlay).not.toBeNull();
  });

  it('should close the overlay on escape', fakeAsync(() => {
    dispatchMouseEvent(trigger, 'mouseover');
    fixture.detectChanges();
    flush();

    let overlay = getContainerElement(overlayContainerElement);
    expect(overlay).not.toBeNull();
    dispatchKeyboardEvent(trigger, 'keydown', ESCAPE);
    fixture.detectChanges();
    flush();
    overlay = getContainerElement(overlayContainerElement);

    expect(overlay).toBeNull();
  }));

  it('should not open an overlay when disabled', fakeAsync(() => {
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    dispatchMouseEvent(trigger, 'mouseover');
    fixture.detectChanges();
    flush();

    const overlay = getContainerElement(overlayContainerElement);
    expect(overlay).toBeNull();
  }));
});

function getContainerElement(overlayContainerElement: HTMLElement): HTMLElement {
  return overlayContainerElement.querySelector('.dt-overlay-container') as HTMLElement;
}

/** dummy component */
@Component({
  selector: 'dt-test-component',
  template: `<div [dtOverlay]="overlay" [dtOverlayConfig]="config"
    [disabled]="disabled">trigger</div><ng-template #overlay>overlay</ng-template>`,
})
class TestComponent {
  config: DtOverlayConfig = {};
  disabled = false;
}
