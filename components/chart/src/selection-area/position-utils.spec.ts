import {
  DtSelectionAreaEventTarget,
  calculatePosition,
} from './position-utils';

// tslint:disable:no-magic-numbers

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
            300,
          ),
        ).toEqual({ left: 110, width: 100 });
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.SelectedArea,
            10,
            190,
            100,
            300,
          ),
        ).toEqual({ left: 200, width: 100 });
      });
      it('should not set the position outside the boundaries when moving to the right', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.SelectedArea,
            10,
            100,
            100,
            200,
          ),
        ).toEqual({ left: 100, width: 100 });
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.SelectedArea,
            10,
            100,
            100,
            205,
          ),
        ).toEqual({ left: 105, width: 100 });
      });
      it('should move the position to the left', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.SelectedArea,
            -10,
            100,
            100,
            300,
          ),
        ).toEqual({ left: 90, width: 100 });
      });
      it('should not set the position outside the boundaries when moving to the left', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.SelectedArea,
            -10,
            0,
            100,
            200,
          ),
        ).toEqual({ left: 0, width: 100 });
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.SelectedArea,
            -10,
            5,
            100,
            205,
          ),
        ).toEqual({ left: 0, width: 100 });
      });
    });

    describe('left 🐔', () => {
      it('should move the position to the left', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.LeftHandle,
            -10,
            100,
            100,
            300,
          ),
        ).toEqual({ left: 90, width: 110 });
      });

      it('should not set the position outside the boundaries when moving to the left', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.LeftHandle,
            -10,
            0,
            100,
            300,
          ),
        ).toEqual({ left: 0, width: 100 });
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.LeftHandle,
            -10,
            5,
            100,
            300,
          ),
        ).toEqual({ left: 0, width: 105 });
      });

      it('should move the position to the right', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.LeftHandle,
            10,
            100,
            100,
            300,
          ),
        ).toEqual({ left: 110, width: 90 });
      });

      it('should move the left handle over the right one', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.LeftHandle,
            10,
            100,
            5,
            300,
          ),
        ).toEqual({ left: 105, width: 0 });
      });

      it('should move the left handle over the right one incl clamp', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.LeftHandle,
            10,
            299,
            1,
            300,
          ),
        ).toEqual({ left: 300, width: 0 });
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
            300,
          ),
        ).toEqual({ left: 100, width: 110 });
      });

      it('should not set the position outside the boundaries when moving to the right', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.RightHandle,
            10,
            200,
            100,
            300,
          ),
        ).toEqual({ left: 200, width: 100 });
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.RightHandle,
            10,
            195,
            100,
            300,
          ),
        ).toEqual({ left: 195, width: 105 });
      });

      it('should move the position to the left', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.RightHandle,
            -10,
            100,
            100,
            300,
          ),
        ).toEqual({ left: 100, width: 90 });
      });

      it('should move the right handle over the left one', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.RightHandle,
            -10,
            100,
            5,
            300,
          ),
        ).toEqual({ left: 100, width: 0 });
      });

      it('should move the right handle over the left one incl clamp', () => {
        expect(
          calculatePosition(
            DtSelectionAreaEventTarget.RightHandle,
            -10,
            0,
            5,
            300,
          ),
        ).toEqual({ left: 0, width: 0 });
      });
    });
  });
});
