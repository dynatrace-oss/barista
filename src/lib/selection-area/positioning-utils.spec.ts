// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers deprecation
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import {
  calculatePosition,
  DtSelectionAreaEventTarget,
} from './positioning-utils';

describe('PositioningUtils', () => {
  describe('calculatePosition', () => {
    describe('selectedArea', () => {
      it('should move the position to the right', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.SelectedArea,
            10,
            100,
            100,
            300
          )
        ).toEqual({
          left: 110,
          width: 100,
          nextTarget: DtSelectionAreaEventTarget.SelectedArea,
        });
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.SelectedArea,
            10,
            190,
            100,
            300
          )
        ).toEqual({
          left: 200,
          width: 100,
          nextTarget: DtSelectionAreaEventTarget.SelectedArea,
        });
      });
      it('should not set the position outside the boundries when moving to the right', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.SelectedArea,
            10,
            100,
            100,
            200
          )
        ).toEqual({
          left: 100,
          width: 100,
          nextTarget: DtSelectionAreaEventTarget.SelectedArea,
        });
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.SelectedArea,
            10,
            100,
            100,
            205
          )
        ).toEqual({
          left: 105,
          width: 100,
          nextTarget: DtSelectionAreaEventTarget.SelectedArea,
        });
      });
      it('should move the position to the left', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.SelectedArea,
            -10,
            100,
            100,
            300
          )
        ).toEqual({
          left: 90,
          width: 100,
          nextTarget: DtSelectionAreaEventTarget.SelectedArea,
        });
      });
      it('should not set the position outside the boundries when moving to the left', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.SelectedArea,
            -10,
            0,
            100,
            200
          )
        ).toEqual({
          left: 0,
          width: 100,
          nextTarget: DtSelectionAreaEventTarget.SelectedArea,
        });
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.SelectedArea,
            -10,
            5,
            100,
            205
          )
        ).toEqual({
          left: 0,
          width: 100,
          nextTarget: DtSelectionAreaEventTarget.SelectedArea,
        });
      });
    });

    describe('left handle', () => {
      it('should move the position to the left', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.LeftHandle,
            -10,
            100,
            100,
            300
          )
        ).toEqual({
          left: 90,
          width: 110,
          nextTarget: DtSelectionAreaEventTarget.LeftHandle,
        });
      });

      it('should not set the position outside the boundaries when moving to the left', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.LeftHandle,
            -10,
            0,
            100,
            300
          )
        ).toEqual({
          left: 0,
          width: 100,
          nextTarget: DtSelectionAreaEventTarget.LeftHandle,
        });
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.LeftHandle,
            -10,
            5,
            100,
            300
          )
        ).toEqual({
          left: 0,
          width: 105,
          nextTarget: DtSelectionAreaEventTarget.LeftHandle,
        });
      });

      it('should move the position to the right', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.LeftHandle,
            10,
            100,
            100,
            300
          )
        ).toEqual({
          left: 110,
          width: 90,
          nextTarget: DtSelectionAreaEventTarget.LeftHandle,
        });
      });

      it('should move the left handle over the right one', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.LeftHandle,
            10,
            100,
            5,
            300
          )
        ).toEqual({
          left: 105,
          width: 5,
          nextTarget: DtSelectionAreaEventTarget.RightHandle,
        });
      });

      it('should move the left handle over the right one incl clamp', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.LeftHandle,
            10,
            299,
            1,
            300
          )
        ).toEqual({
          left: 300,
          width: 0,
          nextTarget: DtSelectionAreaEventTarget.RightHandle,
        });
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.LeftHandle,
            10,
            290,
            5,
            300
          )
        ).toEqual({
          left: 295,
          width: 5,
          nextTarget: DtSelectionAreaEventTarget.RightHandle,
        });
      });
    });

    describe('right 🐔', () => {
      it('should move the position to the right', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.RightHandle,
            10,
            100,
            100,
            300
          )
        ).toEqual({
          left: 100,
          width: 110,
          nextTarget: DtSelectionAreaEventTarget.RightHandle,
        });
      });

      it('should not set the position outside the boundaries when moving to the right', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.RightHandle,
            10,
            200,
            100,
            300
          )
        ).toEqual({
          left: 200,
          width: 100,
          nextTarget: DtSelectionAreaEventTarget.RightHandle,
        });
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.RightHandle,
            10,
            195,
            100,
            300
          )
        ).toEqual({
          left: 195,
          width: 105,
          nextTarget: DtSelectionAreaEventTarget.RightHandle,
        });
      });

      it('should move the position to the left', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.RightHandle,
            -10,
            100,
            100,
            300
          )
        ).toEqual({
          left: 100,
          width: 90,
          nextTarget: DtSelectionAreaEventTarget.RightHandle,
        });
      });

      it('should move the right handle over the left one', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.RightHandle,
            -10,
            100,
            5,
            300
          )
        ).toEqual({
          left: 95,
          width: 5,
          nextTarget: DtSelectionAreaEventTarget.LeftHandle,
        });
      });

      it('should move the right handle over the left one incl clamp', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.RightHandle,
            -10,
            1,
            5,
            300
          )
        ).toEqual({
          left: 0,
          width: 1,
          nextTarget: DtSelectionAreaEventTarget.LeftHandle,
        });
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.RightHandle,
            -10,
            0,
            5,
            300
          )
        ).toEqual({
          left: 0,
          width: 0,
          nextTarget: DtSelectionAreaEventTarget.LeftHandle,
        });
      });
    });
  });
});
