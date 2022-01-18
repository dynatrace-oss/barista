/**
 * @license
 * Copyright 2021 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable @typescript-eslint/unbound-method, no-magic-numbers */

import { NgZone } from '@angular/core';
import { TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay, observeOn, subscribeOn } from 'rxjs/operators';

import { MockNgZone } from '@dynatrace/testing/browser';
import { runInsideZone, runOutsideZone } from './zone-scheduler';

describe('Angular Zone Schedulers', () => {
  let zone: MockNgZone;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: NgZone, useFactory: () => (zone = new MockNgZone()) },
      ],
    });

    zone = TestBed.inject(NgZone) as MockNgZone;
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
    it(
      'should call run on ngZone',
      waitForAsync(() => {
        const test$ = of('this is a test').pipe(observeOn(runInsideZone(zone)));

        test$.subscribe(() => {
          expect(zone.run).toHaveBeenCalledTimes(2);
          expect(zone.runOutsideAngular).not.toHaveBeenCalled();
        });
      }),
    );

    it(
      'should call runOutsideAngular on ngZone',
      waitForAsync(() => {
        const test$ = of('this is a test').pipe(
          observeOn(runOutsideZone(zone)),
        );

        test$.subscribe(() => {
          expect(zone.runOutsideAngular).toHaveBeenCalledTimes(2);
          expect(zone.run).not.toHaveBeenCalled();
        });
      }),
    );
  });

  describe('subscribeOn operators', () => {
    it(
      'should call run on ngZone',
      waitForAsync(() => {
        const test$ = of('this is a test').pipe(
          subscribeOn(runInsideZone(zone)),
        );

        test$.subscribe(() => {
          expect(zone.run).toHaveBeenCalledTimes(1);
          expect(zone.runOutsideAngular).not.toHaveBeenCalled();
        });
      }),
    );

    it(
      'should call runOutsideAngular on ngZone',
      waitForAsync(() => {
        const test$ = of('this is a test').pipe(
          subscribeOn(runOutsideZone(zone)),
        );

        test$.subscribe(() => {
          expect(zone.runOutsideAngular).toHaveBeenCalledTimes(1);
          expect(zone.run).not.toHaveBeenCalled();
        });
      }),
    );
  });
});
