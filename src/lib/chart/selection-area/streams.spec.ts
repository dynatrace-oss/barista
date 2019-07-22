// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { ElementRef, NgZone, QueryList } from '@angular/core';
import * as core from '@dynatrace/angular-components/core';
import { interval, Observable, of, Subject, timer } from 'rxjs';
import { delay, map, mapTo, take } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { createMouseEvent } from '../../../testing/event-objects';
import { MockNgZone } from '../../../testing/mock-ng-zone';
import * as utils from '../utils';
import { NO_POINTER_EVENTS_CLASS } from './constants';
import { DtSelectionAreaEventTarget } from './position-utils';
import {
  getClickStream,
  getDragStream,
  getElementRefStream,
  getMouseDownStream,
  getMouseMove,
  getMouseOutStream,
  getMouseUpStream,
  getRangeCreateStream,
  getRangeResizeStream,
} from './streams';

const MOCK_BOUNDING_CLIENT_RECT: ClientRect = {
  top: 50,
  left: 50,
  height: 200,
  width: 400,
  bottom: 250,
  right: 450,
};

const MOVE_VALUES = {
  a: { x: 151, y: 50 },
  b: { x: 152, y: 50 },
  c: { x: 153, y: 50 },
  d: { x: 154, y: 50 },
};

describe('Selection Area Streams', () => {
  let selectionArea: HTMLElement;
  let testScheduler: TestScheduler;
  let mouseMoveXFn: () => Observable<MouseEvent>;

  beforeEach(() => {
    // tslint:disable ban
    selectionArea = document.createElement('div');
    spyOn(selectionArea, 'getBoundingClientRect').and.returnValue(
      MOCK_BOUNDING_CLIENT_RECT,
    );
    spyOn<any>(selectionArea, 'clientWidth').and.returnValue(
      MOCK_BOUNDING_CLIENT_RECT.width,
    );
    // Set up the TestScheduler to assert with the framework your using (Jasmine in this case)
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    // create a mocked mouseMove function
    mouseMoveXFn = () =>
      interval(1).pipe(
        map(curX => createMouseEvent('mousemove', curX + 401, 300)),
        take(4),
      );
  });

  it('should creat a drag stream', () => {
    const dragStart$ = of(DtSelectionAreaEventTarget.LeftHandle);
    const dragEnd$ = timer(5).pipe(mapTo(createMouseEvent('mouseup')));

    testScheduler.run(({ expectObservable }) => {
      expectObservable(
        getDragStream(selectionArea, dragStart$, dragEnd$, mouseMoveXFn),
      ).toBe('-abc(d|)', MOVE_VALUES);
    });
  });

  it('should create a mousemove stream', () => {
    // mock the capture and merge events to return our faked mousemove
    spyOn(utils, 'captureAndMergeEvents').and.returnValue(mouseMoveXFn());

    testScheduler.run(({ expectObservable }) => {
      expectObservable(getMouseMove(selectionArea, [selectionArea])).toBe(
        '-abc(d|)',
        MOVE_VALUES,
      );

      expect(utils.captureAndMergeEvents).toHaveBeenCalledWith('mousemove', [
        selectionArea,
      ]);
    });
  });

  it('should create a mousedown stream', () => {
    const fakeMouseDown = createMouseEvent('mousedown', 400, 300);

    // mock the capture and merge events to return our faked mousemove
    spyOn(utils, 'captureAndMergeEvents').and.returnValue(of(fakeMouseDown));
    spyOn(core, 'removeCssClass').and.callThrough();

    testScheduler.run(({ expectObservable, flush }) => {
      expectObservable(getMouseDownStream(selectionArea, [selectionArea])).toBe(
        '(a|)',
        { a: fakeMouseDown },
      );
      // need to execute all side effects before expecting
      flush();

      expect(core.removeCssClass).toHaveBeenCalledTimes(1);
      expect(core.removeCssClass).toHaveBeenCalledWith(
        selectionArea,
        NO_POINTER_EVENTS_CLASS,
      );
      expect(utils.captureAndMergeEvents).toHaveBeenCalledWith('mousedown', [
        selectionArea,
      ]);
    });
  });

  it('should create a mouseup stream that triggers a side effect', () => {
    const fakeMouseUp = createMouseEvent('mouseup');

    spyOn(core, 'addCssClass').and.callThrough();

    testScheduler.run(({ expectObservable, flush }) => {
      expectObservable(
        getMouseUpStream(selectionArea, () => of(fakeMouseUp)),
      ).toBe('(a|)', { a: fakeMouseUp });
      // need to execute all side effects before expecting
      flush();

      expect(core.addCssClass).toHaveBeenCalledTimes(1);
      expect(core.addCssClass).toHaveBeenCalledWith(
        selectionArea,
        NO_POINTER_EVENTS_CLASS,
      );
    });
  });

  it('should not create a mousedown stream when the left mouse button is pressed', () => {
    const fakeMouseDown = document.createEvent('MouseEvent');

    fakeMouseDown.initMouseEvent(
      'mousedown',
      false /* canBubble */,
      true /* cancelable */,
      window /* view */,
      0 /* detail */,
      400 /* screen400 */,
      300 /* screenY */,
      400 /* clientX */,
      300 /* clientY */,
      false /* ctrlKey */,
      false /* altKey */,
      false /* shiftKey */,
      false /* metaKey */,
      1 /* button */,
      null /* relatedTarget */,
    );

    // mock the capture and merge events to return our faked mousemove
    spyOn(utils, 'captureAndMergeEvents').and.returnValue(of(fakeMouseDown));
    spyOn(core, 'removeCssClass').and.callThrough();

    testScheduler.run(({ expectObservable, flush }) => {
      expectObservable(getMouseDownStream(selectionArea, [selectionArea])).toBe(
        '(|)',
      );
      // need to execute all side effects before expecting
      flush();

      expect(core.removeCssClass).not.toHaveBeenCalled();
      expect(utils.captureAndMergeEvents).toHaveBeenCalledWith('mousedown', [
        selectionArea,
      ]);
    });
  });

  it('should create a mouseOut stream that is outside the bounding client rect', () => {
    const fakeMouseOut = createMouseEvent('mouseout', 400, 300);

    const fakeOut = {
      x: 600,
      y: 300,
    };

    // mock the capture and merge events to return our faked mousemove
    spyOn(utils, 'captureAndMergeEvents').and.returnValue(of(fakeMouseOut));
    spyOn(utils, 'getRelativeMousePosition').and.returnValue(fakeOut);

    testScheduler.run(({ expectObservable, flush }) => {
      expectObservable(
        getMouseOutStream(
          selectionArea,
          [selectionArea],
          MOCK_BOUNDING_CLIENT_RECT,
        ),
      ).toBe('(a|)', { a: fakeOut });
      // need to execute all side effects before expecting
      flush();

      expect(utils.getRelativeMousePosition).toHaveBeenCalledWith(
        fakeMouseOut,
        selectionArea,
      );
      expect(utils.captureAndMergeEvents).toHaveBeenCalledWith('mouseout', [
        selectionArea,
      ]);
    });
  });

  it('should filter a mouseOut stream that is not outside the bounding client rect', () => {
    const fakeMouseOut = createMouseEvent('mouseout');

    const inside = {
      x: 300,
      y: 150,
    };

    // mock the capture and merge events to return our faked mousemove
    spyOn(utils, 'captureAndMergeEvents').and.returnValue(of(fakeMouseOut));
    spyOn(utils, 'getRelativeMousePosition').and.returnValue(inside);

    testScheduler.run(({ expectObservable, flush }) => {
      expectObservable(
        getMouseOutStream(
          selectionArea,
          [selectionArea],
          MOCK_BOUNDING_CLIENT_RECT,
        ),
      ).toBe('(|)');
      // need to execute all side effects before expecting
      flush();

      expect(utils.getRelativeMousePosition).toHaveBeenCalledWith(
        fakeMouseOut,
        selectionArea,
      );
      expect(utils.captureAndMergeEvents).toHaveBeenCalledWith('mouseout', [
        selectionArea,
      ]);
    });
  });

  it('should create a click stream out of a mousedown and mouse up', () => {
    const clickEndEvent = createMouseEvent('mouseup', 20, 20);

    const clickStart$ = of(createMouseEvent('mousedown'));
    const clickEnd$ = of(clickEndEvent).pipe(delay(2));

    spyOn(utils, 'getRelativeMousePosition').and.returnValue({
      x: 100,
      y: 100,
    });

    testScheduler.run(({ expectObservable, flush }) => {
      expectObservable(
        getClickStream(selectionArea, clickStart$, clickEnd$),
      ).toBe('--(a)', { a: { x: 100, y: 100 } });
      // need to execute all side effects before expecting
      flush();

      expect(utils.getRelativeMousePosition).toHaveBeenCalledWith(
        clickEndEvent,
        selectionArea,
      );
    });
  });

  it('should not create a click stream when the mouseup starts before the mouse down', () => {
    const clickStart$ = of(createMouseEvent('mousedown')).pipe(delay(1));
    const clickEnd$ = of(createMouseEvent('mouseup'));

    spyOn(utils, 'getRelativeMousePosition');

    testScheduler.run(({ expectObservable, flush }) => {
      expectObservable(
        getClickStream(selectionArea, clickStart$, clickEnd$),
      ).toBe('');
      // need to execute all side effects before expecting
      flush();

      expect(utils.getRelativeMousePosition).not.toHaveBeenCalled();
    });
  });

  it('should not create a click stream when there is a mousemove between mousedown and mouseup', () => {
    const clickEndEvent = createMouseEvent('mouseup', 20, 20);

    const clickStart$ = of(createMouseEvent('mousedown'));
    const clickEnd$ = of(clickEndEvent).pipe(delay(5));
    const mouseMoveFn = () => of(createMouseEvent('mousemove')).pipe(delay(3));

    spyOn(utils, 'getRelativeMousePosition');

    testScheduler.run(({ expectObservable, flush }) => {
      expectObservable(
        getClickStream(selectionArea, clickStart$, clickEnd$, mouseMoveFn),
      ).toBe('-----|'); // delay clickEnd$ for 5ms
      // need to execute all side effects before expecting
      flush();

      expect(utils.getRelativeMousePosition).not.toHaveBeenCalled();
    });
  });

  it('should get an elementRef stream when micro tasks are empty', () => {
    const destroy$ = new Subject<void>();
    const changes$ = timer(2);
    const fakeList = new QueryList<ElementRef>();
    const fakeZone = new MockNgZone();

    (fakeZone as any).onMicrotaskEmpty = timer(10);
    (fakeList.first as any) = 'FakeElementRef';

    // create fake operator function getElementRef that returns the fake element ref
    spyOn(utils, 'getElementRef').and.callFake(() => input$ =>
      input$.pipe(mapTo(fakeList.first)),
    );

    testScheduler.run(({ expectObservable, flush }) => {
      expectObservable(
        getElementRefStream(
          changes$,
          destroy$,
          fakeList,
          (fakeZone as unknown) as NgZone,
        ),
      ).toBe('-- 10ms (a|)', { a: 'FakeElementRef' });

      // need to execute all side effects before expecting
      flush();
    });

    destroy$.next();
    destroy$.complete();
  });

  it('should get a range stream for an increasing mousemove', () => {
    const dragStart$ = of({ x: 100, y: 100 });
    const dragMove$ = interval(2).pipe(
      map(curX => ({ x: curX + 101, y: 100 })),
      take(3),
    );

    testScheduler.run(({ expectObservable }) => {
      expectObservable(getRangeCreateStream(dragStart$, dragMove$, 200)).toBe(
        '--a-b-(c|)',
        {
          a: { left: 100, width: 1 },
          b: { left: 100, width: 2 },
          c: { left: 100, width: 3 },
        },
      );
    });
  });

  it('should get a range stream that drops redundant values for an increasing mousemove', () => {
    const dragStart$ = of({ x: 100, y: 100 });
    const dragMove$ = interval(1).pipe(
      map(curX => {
        const add = curX % 2 ? curX : curX + 1;

        return { x: add + 101, y: 100 };
      }),
      take(6),
    );

    testScheduler.run(({ expectObservable }) => {
      expectObservable(getRangeCreateStream(dragStart$, dragMove$, 200)).toBe(
        '-a-b-c|',
        {
          a: { left: 100, width: 2 },
          b: { left: 100, width: 4 },
          c: { left: 100, width: 6 },
        },
      );
    });
  });

  it('should create range resize stream on right handle drag', () => {
    const dragOrigin$ = of(DtSelectionAreaEventTarget.RightHandle);
    const dragMove$ = interval(2).pipe(
      map(curX => ({ x: curX + 251, y: 30 })),
      take(3),
    );
    let called = -1;
    const previousArea = () => {
      called++;
      return { left: 100, width: called + 150 };
    };
    const isRangeValid = () => true;
    const valToPx = (_left, _width): [number, number] => [100, 100];

    testScheduler.run(({ expectObservable }) => {
      expectObservable(
        getRangeResizeStream(
          dragMove$,
          dragOrigin$,
          500,
          previousArea,
          isRangeValid,
          valToPx,
        ),
      ).toBe('--a-b-(c|)', {
        a: { left: 100, width: 151 },
        b: { left: 100, width: 152 },
        c: { left: 100, width: 153 },
      });
    });
  });

  it('should create range resize stream on left handle drag', () => {
    const dragOrigin$ = of(DtSelectionAreaEventTarget.LeftHandle);
    const dragMove$ = interval(2).pipe(
      map(curX => ({ x: 99 - curX, y: 30 })),
      take(3),
    );
    let called = -1;
    const previousArea = () => {
      called++;
      return { left: 100 - called, width: called + 150 };
    };
    const isRangeValid = () => true;
    const valToPx = (_left, _width): [number, number] => [100, 100];

    testScheduler.run(({ expectObservable }) => {
      expectObservable(
        getRangeResizeStream(
          dragMove$,
          dragOrigin$,
          500,
          previousArea,
          isRangeValid,
          valToPx,
        ),
      ).toBe('--a-b-(c|)', {
        a: { left: 99, width: 151 },
        b: { left: 98, width: 152 },
        c: { left: 97, width: 153 },
      });
    });
  });
});
