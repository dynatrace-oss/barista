const enum PageOffsets {
  MAX_ALL_ITEMS = 7,
  LEFT_BORDER = 3,
  LEFT_BORDER_PLUS = 4,
  RIGHT_BORDER_DIFF = 2,
  RIGHT_BORDER_PLUS_DIFF = 3,
}
export type PaginationState = (index: number, currentPage: number, maxPage: number) => boolean;

// 1 (2) 3 4 5
export const paginationStateAll: PaginationState = (index, currentPage, maxPage) => true;

// 1 (2) 3 ... 84 85 86
export const paginationStateOutside: PaginationState = (index, currentPage, maxPage) =>
  index <= PageOffsets.LEFT_BORDER || index >= (maxPage - PageOffsets.RIGHT_BORDER_DIFF);

// 1 2 (3) 4 ... 85 86
export const paginationStateLeftExtended: PaginationState = (index, currentPage, maxPage) =>
  index <= (PageOffsets.LEFT_BORDER + 1) || index > (maxPage - PageOffsets.RIGHT_BORDER_DIFF);

// 1 2 3 (4) 5 ... 86
export const paginationStateLeftExtendedPlus: PaginationState = (index, currentPage, maxPage) =>
  index <= (PageOffsets.LEFT_BORDER_PLUS + 1) || index > (maxPage - PageOffsets.RIGHT_BORDER_DIFF + 1);

// 1 2 ... 83 (84) 85 86
export const paginationStateRightExtended: PaginationState = (index, currentPage, maxPage) =>
  index < (PageOffsets.LEFT_BORDER) || index >= (maxPage - PageOffsets.RIGHT_BORDER_DIFF - 1);

// 1 ... (83) 84 85 86
export const paginationStateRightExtendedPlus: PaginationState = (index, currentPage, maxPage) =>
  index < (PageOffsets.LEFT_BORDER - 1) || index >= (maxPage - PageOffsets.RIGHT_BORDER_PLUS_DIFF - 1);

// 1 ... 54 (55) 56 ... 86
export const paginationStateMiddle: PaginationState = (index, currentPage, maxPage) =>
  (index === 1 || index === maxPage || Math.abs(currentPage - index) <= 1);

export function calculatePaginationState(currentPage: number, maxPage: number): PaginationState {
  if (maxPage > PageOffsets.MAX_ALL_ITEMS) {
    if (currentPage === PageOffsets.LEFT_BORDER) {
      return paginationStateLeftExtended;
    } else if (currentPage === PageOffsets.LEFT_BORDER_PLUS) {
      return paginationStateLeftExtendedPlus;
    } else if (currentPage === (maxPage - PageOffsets.RIGHT_BORDER_DIFF)) {
      return paginationStateRightExtended;
    } else if (currentPage === (maxPage - PageOffsets.RIGHT_BORDER_PLUS_DIFF)) {
      return paginationStateRightExtendedPlus;
    } else if (currentPage <= PageOffsets.LEFT_BORDER || currentPage >= (maxPage - PageOffsets.RIGHT_BORDER_DIFF)) {
      return paginationStateOutside;
    } else {
      return paginationStateMiddle;
    }
  }
  return paginationStateAll;
}
