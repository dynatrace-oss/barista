import {
  calculatePaginationState,
  paginationStateAll,
  paginationStateLeftExtended,
  paginationStateLeftExtendedPlus, paginationStateMiddle,
  paginationStateOutside, paginationStateRightExtended,
  paginationStateRightExtendedPlus
} from './index';

describe('pagination states', () => {

  it('should support state all', () => {
    expect(calculatePaginationState(1, 5)).toBe(paginationStateAll);
  });

  it('should have correct states', () => {
    expect(calculatePaginationState(1, 11)).toBe(paginationStateOutside);
    expect(calculatePaginationState(2, 11)).toBe(paginationStateOutside);
    expect(calculatePaginationState(3, 11)).toBe(paginationStateLeftExtended);
    expect(calculatePaginationState(4, 11)).toBe(paginationStateLeftExtendedPlus);
    expect(calculatePaginationState(5, 11)).toBe(paginationStateMiddle);
    expect(calculatePaginationState(6, 11)).toBe(paginationStateMiddle);
    expect(calculatePaginationState(7, 11)).toBe(paginationStateMiddle);
    expect(calculatePaginationState(8, 11)).toBe(paginationStateRightExtendedPlus);
    expect(calculatePaginationState(9, 11)).toBe(paginationStateRightExtended);
    expect(calculatePaginationState(10, 11)).toBe(paginationStateOutside);
    expect(calculatePaginationState(11, 11)).toBe(paginationStateOutside);
  });

});
