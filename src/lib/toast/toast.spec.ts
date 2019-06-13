// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { ComponentFixture, TestBed, fakeAsync, inject, flush, tick, flushMicrotasks } from '@angular/core/testing';
import { Component } from '@angular/core';
import { DtToastModule, DtToast, DT_TOAST_FADE_TIME, DT_TOAST_MIN_DURATION, DT_TOAST_CHAR_LIMIT } from '@dynatrace/angular-components';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';
import { dispatchFakeEvent } from '../../testing/dispatch-events';

describe('DtToast', () => {
  let dtToast: DtToast;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  let fixture: ComponentFixture<TestComponent>;

  const simpleMessage = 'Your changes have been saved!';

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [DtToastModule, NoopAnimationsModule],
      declarations: [TestComponent],
    }).compileComponents();
  }));

  beforeEach(inject([DtToast, OverlayContainer], (toast: DtToast, oc: OverlayContainer) => {
    dtToast = toast;
    overlayContainer = oc;
    overlayContainerElement = oc.getContainerElement();
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

  }));

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should have the role of alert', () => {
    dtToast.create(simpleMessage);

    const containerElement = overlayContainerElement.querySelector('.dt-toast-container')!;
    expect(containerElement.getAttribute('role'))
        .toBe('alert', 'Expected toast container to have role="alert"');
   });

  it('should open a simple message', () => {
    dtToast.create(simpleMessage);

    fixture.detectChanges();

    const messageElement = overlayContainerElement.querySelector('.dt-toast-container')!;
    expect(messageElement.textContent)
        .toContain(simpleMessage, `Expected the toast message to be '${simpleMessage}'`);
  });

  it('should not create a toast with empty message', () => {
    dtToast.create('');

    fixture.detectChanges();

    const messageElement = overlayContainerElement.querySelector('.dt-toast-container')!;
    expect(messageElement).toBeNull();
  });

  it('should cut of the message if it exceeds the limit and limit duration', fakeAsync(() => {
    const longMsg = new Array(DT_TOAST_CHAR_LIMIT + 10).map(() => '.').join();
    const toastRef = dtToast.create(longMsg);
    const afterDismissSpy = jasmine.createSpy('after dismiss spy');
    toastRef!.afterDismissed().subscribe(afterDismissSpy);

    fixture.detectChanges();

    const messageElement = overlayContainerElement.querySelector('.dt-toast-container')!;
    expect(messageElement.textContent!.length).toBe(DT_TOAST_CHAR_LIMIT);
    tick(toastRef!.duration / 2);
    expect(afterDismissSpy).not.toHaveBeenCalled();

    tick(toastRef!.duration / 2);
    fixture.detectChanges();
    expect(afterDismissSpy).toHaveBeenCalled();
  }));

  it('should dismiss the toast and remove itself from the view', fakeAsync(() => {
    const dismissCompleteSpy = jasmine.createSpy('dismiss complete spy');

    const toastRef = dtToast.create(simpleMessage);
    fixture.detectChanges();
    expect(overlayContainerElement.childElementCount)
        .toBeGreaterThan(0, 'Expected overlay container element to have at least one child');

    toastRef!.afterDismissed().subscribe(() => {}, () => {}, dismissCompleteSpy);

    toastRef!.dismiss();
    fixture.detectChanges();
    flush();

    expect(dismissCompleteSpy).toHaveBeenCalled();
    expect(overlayContainerElement.childElementCount)
        .toBe(0, 'Expected the overlay container element to have no child elements');
  }));

  it('should be able to get dismissed through the service', fakeAsync(() => {
    dtToast.create(simpleMessage);
    fixture.detectChanges();
    expect(overlayContainerElement.childElementCount).toBeGreaterThan(0);

    dtToast.dismiss();
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.childElementCount).toBe(0);
  }));

  it('should set the animation state to enter on entry', () => {
    const toastRef = dtToast.create(simpleMessage);

    fixture.detectChanges();
    expect(toastRef!.containerInstance._animationState)
        .toBe('enter', `Expected the animation state would be 'enter'.`);
    toastRef!.dismiss();

    fixture.detectChanges();
    expect(toastRef!.containerInstance._animationState)
        .toBe('exit', `Expected the animation state would be 'exit'.`);
  });

  it('should set the animation state to complete on exit', () => {
    const toastRef = dtToast.create(simpleMessage);
    toastRef!.dismiss();

    fixture.detectChanges();
    expect(toastRef!.containerInstance._animationState)
        .toBe('exit', `Expected the animation state would be 'exit'.`);
  });

  it(
    `should set the old toast animation state to exit and the new toast animation
      state to enter on entry of new toast`,
    fakeAsync(() => {
      const toastRef = dtToast.create(simpleMessage);
      const dismissCompleteSpy = jasmine.createSpy('dismiss complete spy');

      fixture.detectChanges();
      expect(toastRef!.containerInstance._animationState)
          .toBe('enter', `Expected the animation state would be 'enter'.`);

      const toastRef2 = dtToast.create(simpleMessage);

      fixture.detectChanges();
      toastRef!.afterDismissed().subscribe(() => {}, () => {}, dismissCompleteSpy);
      tick(DT_TOAST_FADE_TIME);
      expect(toastRef2!.containerInstance._animationState)
          .toBe('enter', `Expected the animation state of the new toast to be 'enter'.`);

      expect(dismissCompleteSpy).toHaveBeenCalled();
      expect(toastRef!.containerInstance._animationState)
          .toBe('exit', `Expected the animation state would be 'exit'.`);
      tick(DT_TOAST_MIN_DURATION);
    }));

  it('should open a new toast after dismissing a previous toast', fakeAsync(() => {
    let toastRef = dtToast.create(simpleMessage);

    fixture.detectChanges();

    toastRef!.dismiss();
    fixture.detectChanges();

    // Wait for the toast dismiss animation to finish.
    flush();
    toastRef = dtToast.create('test');
    fixture.detectChanges();

    // Wait for the toast open animation to finish.
    tick(DT_TOAST_FADE_TIME);
    expect(toastRef!.containerInstance._animationState)
    .toBe('enter', `Expected the animation state to be 'enter'.`);
    tick(DT_TOAST_MIN_DURATION);
  }));

  it('should remove past toasts when opening new toasts', fakeAsync(() => {
    dtToast.create('First toast');
    fixture.detectChanges();
    tick();

    dtToast.create('Second toast');
    fixture.detectChanges();
    tick();

    dtToast.create('Third toast');
    fixture.detectChanges();
    tick();
    expect(overlayContainerElement.textContent!.trim()).toBe('Third toast');
    tick(DT_TOAST_MIN_DURATION);
  }));

  it('should remove toast if another is shown while its still animating open', fakeAsync(() => {
    dtToast.create('First toast');
    fixture.detectChanges();

    dtToast.create('Second toast');
    fixture.detectChanges();

    tick();
    expect(overlayContainerElement.textContent!.trim()).toBe('Second toast');
    tick(DT_TOAST_MIN_DURATION);
  }));

  it('should dismiss automatically after a specified timeout', fakeAsync(() => {
    const toastRef = dtToast.create('short');
    const afterDismissSpy = jasmine.createSpy('after dismiss spy');
    toastRef!.afterDismissed().subscribe(afterDismissSpy);

    fixture.detectChanges();
    tick();
    expect(afterDismissSpy).not.toHaveBeenCalled();

    /** wait longer then the duration */
    tick(toastRef!.duration * 2);
    fixture.detectChanges();
    tick();
    expect(afterDismissSpy).toHaveBeenCalled();
  }));

  it('should clamp the duration to a minimum', fakeAsync(() => {
    const toastRef = dtToast.create('1');
    const afterDismissSpy = jasmine.createSpy('after dismiss spy');
    toastRef!.afterDismissed().subscribe(afterDismissSpy);

    fixture.detectChanges();
    tick(DT_TOAST_MIN_DURATION / 2);
    expect(afterDismissSpy).not.toHaveBeenCalled();

    /** wait longer then the duration */
    tick(DT_TOAST_MIN_DURATION / 2);
    fixture.detectChanges();
    tick();
    expect(afterDismissSpy).toHaveBeenCalled();
  }));

  it('should clear the dismiss timeout when dismissed before timeout expiration', fakeAsync(() => {
    const toastRef = dtToast.create('content message is very long and takes a long time');

    setTimeout(() => { dtToast.dismiss(); }, toastRef!.duration / 2);

    tick(toastRef!.duration);
    fixture.detectChanges();
    tick();

    expect(fixture.isStable()).toBe(true);
  }));

  it('should pause dismissing the toast when hovering', fakeAsync(() => {
    const longMsg = new Array(DT_TOAST_CHAR_LIMIT + 10).map(() => '.').join();
    const toastRef = dtToast.create(longMsg);
    const afterDismissSpy = jasmine.createSpy('after dismiss spy');
    toastRef!.afterDismissed().subscribe(afterDismissSpy);

    fixture.detectChanges();

    const messageElement = overlayContainerElement.querySelector('.dt-toast-container')!;
    expect(messageElement.textContent!.length).toBe(DT_TOAST_CHAR_LIMIT);

    tick(toastRef!.duration / 2);
    dispatchFakeEvent(messageElement, 'mouseenter');
    expect(afterDismissSpy).not.toHaveBeenCalled();

    tick(toastRef!.duration);
    fixture.detectChanges();
    expect(afterDismissSpy).not.toHaveBeenCalled();
    dispatchFakeEvent(messageElement, 'mouseleave');
    fixture.detectChanges();
    expect(afterDismissSpy).not.toHaveBeenCalled();

    tick(toastRef!.duration / 2);
    fixture.detectChanges();
    flushMicrotasks();
    expect(afterDismissSpy).toHaveBeenCalled();
  }));
});

/** dummy component */
@Component({
  selector: 'dt-test-component',
  template: '',
})
class TestComponent {
}
