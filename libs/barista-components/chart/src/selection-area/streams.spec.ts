/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { ElementRef, NgZone, QueryList } from '@angular/core';
import { Subject, interval, of, timer } from 'rxjs';
import { delay, map, mapTo, take } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';

// We have to import from the file directly as barrel files only expose getters no setters.
// To mock the specific function of the file we have to import the file and disable the
// module boundaries linting rule.
// eslint-disable-next-line
import * as platformUtil from '../../../core/src/util/platform-util';

import { createMouseEvent, MockNgZone } from '@dynatrace/testing/browser';
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

const MOCK_BOUNDING_CLIENT_RECT: DOMRect = {
  top: 50,
  left: 50,
  height: 200,
  width: 400,
  bottom: 250,
  right: 450,
  x: 50,
  y: 50,
  toJSON: () => '',
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
  let relativeMousePositionSpy: any; // jest.SpyInstance;

  beforeEach(() => {
    // eslint-disable
    selectionArea = document.createElement('div');

    relativeMousePositionSpy = jest
      .spyOn(utils, 'getRelativeMousePosition')
      .mockImplementation((event) => ({
        x: (event as MouseEvent).clientX - MOCK_BOUNDING_CLIENT_RECT.left,
        y: (event as MouseEvent).clientY - MOCK_BOUNDING_CLIENT_RECT.top,
      }));

    // Set up the TestScheduler to assert with the framework your using (Jasmine in this case)
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  afterEach(() => {
    relativeMousePositionSpy.mockClear();
  });

  it('should creat a drag stream', () => {
    const dragStart$ = of(DtSelectionAreaEventTarget.LeftHandle);
    const dragEnd$ = timer(5).pipe(mapTo(createMouseEvent('mouseup')));

    const mouseMoveInterval = interval(1).pipe(
      map((curX) => createMouseEvent('mousemove', curX + 201, 100)),
      take(4),
    );

    testScheduler.run(({ expectObservable }) => {
      expectObservable(
        getDragStream(selectionArea, dragStart$, dragEnd$, mouseMoveInterval),
      ).toBe('-abc(d|)', MOVE_VALUES);
    });
  });

  it('should create a mousemove stream', () => {
    // mock the capture and merge events to return our faked mousemove

    const mouseMoveInterval = interval(1).pipe(
      map((curX) => createMouseEvent('mousemove', curX + 201, 100)),
      take(4),
    );

    const utilaSpy = jest
      .spyOn(utils, 'captureAndMergeEvents')
      .mockReturnValue(mouseMoveInterval);

    testScheduler.run(({ expectObservable }) => {
      expectObservable(getMouseMove(selectionArea, [selectionArea])).toBe(
        '-abc(d|)',
        MOVE_VALUES,
      );

      expect(utils.captureAndMergeEvents).toHaveBeenCalledWith('mousemove', [
        selectionArea,
      ]);
    });

    utilaSpy.mockClear();
  });

  it('should create a mousedown stream', () => {
    const fakeMouseDown = createMouseEvent('mousedown', 200, 100);

    // mock the capture and merge events to return our faked mousemove
    const captureSpy = jest
      .spyOn(utils, 'captureAndMergeEvents')
      .mockReturnValue(of(fakeMouseDown));
    const coreSpy = jest.spyOn(platformUtil, '_removeCssClass');

    testScheduler.run(({ expectObservable, flush }) => {
      expectObservable(getMouseDownStream(selectionArea, [selectionArea])).toBe(
        '(a|)',
        { a: fakeMouseDown },
      );
      // need to execute all side effects before expecting
      flush();

      expect(platformUtil._removeCssClass).toHaveBeenCalledTimes(1);
      expect(platformUtil._removeCssClass).toHaveBeenCalledWith(
        selectionArea,
        NO_POINTER_EVENTS_CLASS,
      );
      expect(utils.captureAndMergeEvents).toHaveBeenCalledWith('mousedown', [
        selectionArea,
      ]);
    });

    coreSpy.mockClear();
    captureSpy.mockClear();
  });

  it('should create a mouseup stream that triggers a side effect', () => {
    const fakeMouseUp = createMouseEvent('mouseup');

    const coreSpy = jest.spyOn(platformUtil, '_addCssClass');

    testScheduler.run(({ expectObservable, flush }) => {
      expectObservable(getMouseUpStream(selectionArea, of(fakeMouseUp))).toBe(
        '(a|)',
        { a: fakeMouseUp },
      );
      // need to execute all side effects before expecting
      flush();

      expect(platformUtil._addCssClass).toHaveBeenCalledTimes(1);
      expect(platformUtil._addCssClass).toHaveBeenCalledWith(
        selectionArea,
        NO_POINTER_EVENTS_CLASS,
      );
    });

    coreSpy.mockClear();
  });

  it('should not create a mousedown stream when the left mouse button is pressed', () => {
    const fakeMouseDown = document.createEvent('MouseEvent');

    fakeMouseDown.initMouseEvent(
      'mousedown',
      false /* canBubble */,
      true /* cancelable */,
      window /* view */,
      0 /* detail */,
      200 /* screen400 */,
      100 /* screenY */,
      200 /* clientX */,
      100 /* clientY */,
      false /* ctrlKey */,
      false /* altKey */,
      false /* shiftKey */,
      false /* metaKey */,
      1 /* button */,
      null /* relatedTarget */,
    );

    // mock the capture and merge events to return our faked mousemove
    const captureSpy = jest
      .spyOn(utils, 'captureAndMergeEvents')
      .mockReturnValue(of(fakeMouseDown));
    const cssClassSpy = jest.spyOn(platformUtil, '_removeCssClass');

    testScheduler.run(({ expectObservable, flush }) => {
      expectObservable(getMouseDownStream(selectionArea, [selectionArea])).toBe(
        '(|)',
      );
      // need to execute all side effects before expecting
      flush();

      expect(platformUtil._removeCssClass).not.toHaveBeenCalled();
      expect(utils.captureAndMergeEvents).toHaveBeenCalledWith('mousedown', [
        selectionArea,
      ]);
    });

    captureSpy.mockClear();
    cssClassSpy.mockClear();
  });

  it('should create a mouseOut stream that is outside the bounding client rect', () => {
    const fakeMouseOut = createMouseEvent('mouseout', 200, 100);

    const fakeOut = {
      x: 600,
      y: 300,
    };

    // mock the capture and merge events to return our faked mousemove
    const captureSpy = jest
      .spyOn(utils, 'captureAndMergeEvents')
      .mockReturnValue(of(fakeMouseOut));
    const utilaSpy = jest
      .spyOn(utils, 'getRelativeMousePosition')
      .mockReturnValue(fakeOut);

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

    captureSpy.mockClear();
    utilaSpy.mockClear();
  });

  it('should filter a mouseOut stream that is not outside the bounding client rect', () => {
    const fakeMouseOut = createMouseEvent('mouseout');

    const inside = {
      x: 300,
      y: 150,
    };

    // mock the capture and merge events to return our faked mousemove
    const captureSpy = jest
      .spyOn(utils, 'captureAndMergeEvents')
      .mockReturnValue(of(fakeMouseOut));
    const utilaSpy = jest
      .spyOn(utils, 'getRelativeMousePosition')
      .mockReturnValue(inside);

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

    captureSpy.mockClear();
    utilaSpy.mockClear();
  });

  it('should create a click stream out of a mousedown and mouse up', () => {
    const clickEndEvent = createMouseEvent('mouseup', 20, 20);

    const clickStart$ = of(createMouseEvent('mousedown'));
    const clickEnd$ = of(clickEndEvent).pipe(delay(2));

    const utilSpy = jest
      .spyOn(utils, 'getRelativeMousePosition')
      .mockReturnValue({
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

    utilSpy.mockClear();
  });

  it('should not create a click stream when the mouseup starts before the mouse down', () => {
    const clickStart$ = of(createMouseEvent('mousedown')).pipe(delay(1));
    const clickEnd$ = of(createMouseEvent('mouseup'));
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
    const mouseMove$ = of(createMouseEvent('mousemove')).pipe(delay(3));

    jest.spyOn(utils, 'getRelativeMousePosition');

    testScheduler.run(({ expectObservable, flush }) => {
      expectObservable(
        getClickStream(selectionArea, clickStart$, clickEnd$, mouseMove$),
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
    jest
      .spyOn(utils, 'getElementRef')
      .mockImplementation(() => (input$) => input$.pipe(mapTo(fakeList.first)));

    testScheduler.run(({ expectObservable, flush }) => {
      expectObservable(
        getElementRefStream(
          changes$,
          destroy$,
          fakeList,
          fakeZone as unknown as NgZone,
        ),
      ).toBe('-- (a|)', { a: 'FakeElementRef' });

      // need to execute all side effects before expecting
      flush();
    });

    destroy$.next();
    destroy$.complete();
  });

  it('should get a range stream for an increasing mousemove', () => {
    const dragStart$ = of({ x: 100, y: 100 });
    const dragMove$ = interval(2).pipe(
      map((curX) => ({ x: curX + 101, y: 100 })),
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
      map((curX) => {
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
      map((curX) => ({ x: curX + 251, y: 30 })),
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
      map((curX) => ({ x: 99 - curX, y: 30 })),
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
