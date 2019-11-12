// tslint:disable: no-unbound-method no-magic-numbers

import { NgZone } from '@angular/core';
import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay, observeOn, subscribeOn } from 'rxjs/operators';

import { MockNgZone } from '../../../testing/mock-ng-zone';
import { runInsideZone, runOutsideZone } from './zone-scheduler';

describe('Angular Zone Schedulers', () => {
  let zone: MockNgZone;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: NgZone, useFactory: () => (zone = new MockNgZone()) },
      ],
    });

    zone = TestBed.get(NgZone);
    jest.spyOn(zone, 'run');
    jest.spyOn(zone, 'runOutsideAngular');
  });

  describe('producers', () => {
    it('should call run on ngZone after 300ms delay', fakeAsync(() => {
      const test$ = of('this is a test').pipe(delay(300, runInsideZone(zone)));

      test$.subscribe(() => {
        expect(zone.run).toHaveBeenCalledTimes(1);
        expect(zone.runOutsideAngular).not.toHaveBeenCalled();
      });

      tick(300);
    }));

    it('should call runOutsideAngular on ngZone after 300ms delay', fakeAsync(() => {
      const test$ = of('this is a test').pipe(delay(300, runOutsideZone(zone)));

      test$.subscribe(() => {
        expect(zone.runOutsideAngular).toHaveBeenCalledTimes(1);
        expect(zone.run).not.toHaveBeenCalled();
      });

      tick(300);
    }));
  });

  describe('observeOn operators', () => {
    it('should call run on ngZone', async(() => {
      const test$ = of('this is a test').pipe(observeOn(runInsideZone(zone)));

      test$.subscribe(() => {
        expect(zone.run).toHaveBeenCalledTimes(2);
        expect(zone.runOutsideAngular).not.toHaveBeenCalled();
      });
    }));

    it('should call runOutsideAngular on ngZone', async(() => {
      const test$ = of('this is a test').pipe(observeOn(runOutsideZone(zone)));

      test$.subscribe(() => {
        expect(zone.runOutsideAngular).toHaveBeenCalledTimes(2);
        expect(zone.run).not.toHaveBeenCalled();
      });
    }));
  });

  describe('subscribeOn operators', () => {
    it('should call run on ngZone', async(() => {
      const test$ = of('this is a test').pipe(subscribeOn(runInsideZone(zone)));

      test$.subscribe(() => {
        expect(zone.run).toHaveBeenCalledTimes(1);
        expect(zone.runOutsideAngular).not.toHaveBeenCalled();
      });
    }));

    it('should call runOutsideAngular on ngZone', async(() => {
      const test$ = of('this is a test').pipe(
        subscribeOn(runOutsideZone(zone)),
      );

      test$.subscribe(() => {
        expect(zone.runOutsideAngular).toHaveBeenCalledTimes(1);
        expect(zone.run).not.toHaveBeenCalled();
      });
    }));
  });
});
