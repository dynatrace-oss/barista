// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import * as core from '@dynatrace/angular-components/core';
import { interval, Observable, of, timer } from 'rxjs';
import { map, mapTo, take } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { createMouseEvent } from '../../../testing/event-objects';
import { DtSelectionAreaEventTarget } from '../../selection-area/positioning-utils';
import * as utils from '../utils';
import { NO_POINTER_EVENTS_CLASS } from './constants';
import { getDragStream, getMouseDownStream, getMouseMove } from './streams';

// tslint:disable no-magic-numbers

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
      MOCK_BOUNDING_CLIENT_RECT
    );
    spyOn<any>(selectionArea, 'clientWidth').and.returnValue(
      MOCK_BOUNDING_CLIENT_RECT.width
    );
    // Set up the TestScheduler to assert with the framework your using (Jasmine in this case)
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    // create a mocked mouseMove function
    mouseMoveXFn = () =>
      interval(1).pipe(
        map((curX) => createMouseEvent('mousemove', curX + 401, 300)),
        take(4)
      );
  });

  it('should creat a drag stream', () => {
    const dragStart$ = of(DtSelectionAreaEventTarget.LeftHandle);
    const dragEnd$ = timer(5).pipe(mapTo(createMouseEvent('mouseup')));

    testScheduler.run(({ expectObservable }) => {
      expectObservable(
        getDragStream(selectionArea, dragStart$, dragEnd$, mouseMoveXFn)
      ).toBe('-abc(d|)', MOVE_VALUES);
    });
  });

  it('should create a mousemove stream', () => {
    // mock the capture and merge events to return our faked mousemove
    spyOn(utils, 'captureAndMergeEvents').and.returnValue(mouseMoveXFn());

    testScheduler.run(({ expectObservable }) => {
      expectObservable(getMouseMove(selectionArea, [selectionArea])).toBe(
        '-abc(d|)',
        MOVE_VALUES
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
        { a: fakeMouseDown }
      );
      // need to execute all side effects before expecting
      flush();

      expect(core.removeCssClass).toHaveBeenCalledTimes(1);
      expect(core.removeCssClass).toHaveBeenCalledWith(
        selectionArea,
        NO_POINTER_EVENTS_CLASS
      );
      expect(utils.captureAndMergeEvents).toHaveBeenCalledWith('mousedown', [
        selectionArea,
      ]);
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
      null /* relatedTarget */
    );

    // mock the capture and merge events to return our faked mousemove
    spyOn(utils, 'captureAndMergeEvents').and.returnValue(of(fakeMouseDown));
    spyOn(core, 'removeCssClass').and.callThrough();

    testScheduler.run(({ expectObservable, flush }) => {
      expectObservable(getMouseDownStream(selectionArea, [selectionArea])).toBe(
        '(|)'
      );
      // need to execute all side effects before expecting
      flush();

      expect(core.removeCssClass).not.toHaveBeenCalled();
      expect(utils.captureAndMergeEvents).toHaveBeenCalledWith('mousedown', [
        selectionArea,
      ]);
    });
  });
});
