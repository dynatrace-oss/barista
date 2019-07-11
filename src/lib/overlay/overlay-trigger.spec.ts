// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { ENTER, ESCAPE, SPACE } from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DT_OVERLAY_DEFAULT_OFFSET,
  DtOverlayConfig,
  DtOverlayModule,
} from '@dynatrace/angular-components';
import { createComponent } from '../../testing/create-component';
import {
  dispatchKeyboardEvent,
  dispatchMouseEvent,
} from '../../testing/dispatch-events';

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
    fixture = createComponent(TestComponent);
    trigger = fixture.debugElement.query(By.css('.dt-overlay-trigger'))
      .nativeElement;
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should create an overlay on mouseover and move and dismiss on mouseout', fakeAsync(() => {
    initOverlay(fixture, trigger);

    let overlay = getContainerElement(overlayContainerElement);
    expect(overlay).toBeDefined();
    expect(overlay.innerText).toEqual('overlayfocusme');

    dispatchMouseEvent(trigger, 'mouseout');
    fixture.detectChanges();
    flush();

    overlay = getContainerElement(overlayContainerElement);
    expect(overlay).toBeNull();
  }));

  it('should set the offset to the mouseposition and deal with initial offset', fakeAsync(() => {
    const offset = 1;

    initOverlay(fixture, trigger);

    dispatchMouseEvent(
      trigger,
      'mousemove',
      trigger.getBoundingClientRect().left + offset,
      trigger.getBoundingClientRect().top + offset
    );
    fixture.detectChanges();
    flush();

    const overlayPane = overlayContainerElement.querySelector(
      '.cdk-overlay-pane'
    ) as HTMLElement;
    expect(overlayPane).toBeDefined();
    expect(overlayPane.style.transform).toEqual(
      `translateX(${DT_OVERLAY_DEFAULT_OFFSET +
        1}px) translateY(${DT_OVERLAY_DEFAULT_OFFSET + offset}px)`
    );
  }));

  it('should not be pinnable by default', fakeAsync(() => {
    initOverlay(fixture, trigger);

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
    initOverlay(fixture, trigger);

    dispatchMouseEvent(trigger, 'click');
    fixture.detectChanges();
    flush();

    dispatchMouseEvent(trigger, 'mouseout');
    flush();

    const overlay = getContainerElement(overlayContainerElement);
    expect(overlay).not.toBeNull();
  }));

  it('should stay pinned on subsequent mouseover', fakeAsync(() => {
    fixture.componentInstance.config = { pinnable: true };
    fixture.detectChanges();
    initOverlay(fixture, trigger);

    dispatchMouseEvent(trigger, 'click');
    fixture.detectChanges();
    flush();

    dispatchMouseEvent(trigger, 'mouseout');
    fixture.detectChanges();

    let overlay = getOverlayPane(overlayContainerElement);

    dispatchMouseEvent(trigger, 'mouseover');
    dispatchMouseEvent(trigger, 'mousemove');
    fixture.detectChanges();
    flush();

    overlay = getOverlayPane(overlayContainerElement);

    expect(overlay).not.toBeNull();
  }));

  it('should lock movement to xAxis', fakeAsync(() => {
    const offset = 1;
    fixture.componentInstance.config = { movementConstraint: 'xAxis' };
    fixture.detectChanges();
    initOverlay(fixture, trigger);
    dispatchMouseEvent(
      trigger,
      'mousemove',
      trigger.getBoundingClientRect().left + offset,
      trigger.getBoundingClientRect().top + offset
    );
    fixture.detectChanges();
    flush();

    const overlayPane = overlayContainerElement.querySelector(
      '.cdk-overlay-pane'
    ) as HTMLElement;
    expect(overlayPane.style.transform).toEqual(
      `translateX(${DT_OVERLAY_DEFAULT_OFFSET +
        offset}px) translateY(${DT_OVERLAY_DEFAULT_OFFSET}px)`
    );
  }));

  it('should lock movement to yAxis', fakeAsync(() => {
    const offset = 1;
    fixture.componentInstance.config = { movementConstraint: 'yAxis' };
    fixture.detectChanges();
    initOverlay(fixture, trigger);
    dispatchMouseEvent(
      trigger,
      'mousemove',
      trigger.getBoundingClientRect().left + offset,
      trigger.getBoundingClientRect().top + offset
    );
    fixture.detectChanges();
    flush();

    const overlayPane = overlayContainerElement.querySelector(
      '.cdk-overlay-pane'
    ) as HTMLElement;
    expect(overlayPane.style.transform).toEqual(
      `translateX(${DT_OVERLAY_DEFAULT_OFFSET}px) translateY(${DT_OVERLAY_DEFAULT_OFFSET +
        offset}px)`
    );
  }));

  it('should focus the trigger', () => {
    expect(document.activeElement).not.toBe(trigger);

    trigger.focus();
    fixture.detectChanges();

    expect(document.activeElement).toBe(trigger);
  });

  it('should not change the focus if the overlay is not pinned', fakeAsync(() => {
    const previouslyFocused = document.activeElement;
    initOverlay(fixture, trigger);
    expect(document.activeElement).toBe(previouslyFocused);
  }));

  it('should change the focus if the overlay pinned', fakeAsync(() => {
    const previouslyFocused = document.activeElement;
    fixture.componentInstance.config = { pinnable: true };
    fixture.detectChanges();
    initOverlay(fixture, trigger);

    dispatchMouseEvent(trigger, 'click');
    fixture.detectChanges();
    flush();

    expect(document.activeElement).not.toBe(previouslyFocused);
  }));

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
    initOverlay(fixture, trigger);

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

    initOverlay(fixture, trigger);

    const overlay = getContainerElement(overlayContainerElement);
    expect(overlay).toBeNull();
  }));

  it('should destroy the overlay when trigger is destroyed', fakeAsync(() => {
    initOverlay(fixture, trigger);
    fixture.detectChanges();
    let overlay = getContainerElement(overlayContainerElement);
    expect(overlay).not.toBeNull();

    fixture.componentInstance.showTrigger = false;
    fixture.detectChanges();
    flush();

    overlay = getContainerElement(overlayContainerElement);
    expect(overlay).toBeNull();
  }));
});

function initOverlay(
  fixture: ComponentFixture<TestComponent>,
  trigger: HTMLElement
): void {
  dispatchMouseEvent(trigger, 'mouseover');
  dispatchMouseEvent(trigger, 'mousemove');
  fixture.detectChanges();
  flush();
}

function getContainerElement(
  overlayContainerElement: HTMLElement
): HTMLElement {
  return overlayContainerElement.querySelector(
    '.dt-overlay-container'
  ) as HTMLElement;
}
function getOverlayPane(overlayContainerElement: HTMLElement): HTMLElement {
  return overlayContainerElement.querySelector(
    '.cdk-overlay-pane'
  ) as HTMLElement;
}

/** Test component */
@Component({
  selector: 'dt-test-component',
  template: `
    <div
      *ngIf="showTrigger"
      [dtOverlay]="overlay"
      [dtOverlayConfig]="config"
      [disabled]="disabled"
    >
      trigger
    </div>
    <ng-template #overlay>
      overlay
      <button>focusme</button>
    </ng-template>
  `,
})
class TestComponent {
  config: DtOverlayConfig = {};
  disabled = false;
  showTrigger = true;
}
