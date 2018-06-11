import { TestBed, async, inject, tick, fakeAsync } from '@angular/core/testing';
import { DtViewportResizer } from '@dynatrace/angular-components';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Platform } from '@angular/cdk/platform';

function createFakeEvent(type: string): Event {
  const event = document.createEvent('Event');
  event.initEvent(type, true, true);

  return event;
}

describe('DefaultViewportResizer', () => {
  let resizer: DtViewportResizer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        ViewportRuler,
        Platform,
      ],
    });
  }));

  beforeEach(inject([DtViewportResizer], (viewportResizer: DtViewportResizer) => {
    resizer = viewportResizer;
  }));

  it('should emit on resize', fakeAsync(() => {
    const spy = jasmine.createSpy('viewport changed spy');
    const subscription = resizer.change().subscribe(spy);

    window.dispatchEvent(createFakeEvent('resize'));
    tick(150);
    expect(spy).toHaveBeenCalled();
    subscription.unsubscribe();
  }));
});
