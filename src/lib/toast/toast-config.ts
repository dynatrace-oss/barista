import { OverlayConfig } from '@angular/cdk/overlay';

/** Spacing for the toast from the bottom of the page */
export const DT_TOAST_BOTTOM_SPACING = 24;

/** Default toast configuration */
export const DT_TOAST_DEFAULT_CONFIG: OverlayConfig = {
  hasBackdrop: false,
  minHeight: 52,
};

/** Time to perceive a new toast */
export const DT_TOAST_PERCEIVE_TIME = 500;
/** time to perceive one character */
export const DT_TOAST_CHAR_READ_TIME = 50;
/** Fade animation duration */
export const DT_TOAST_FADE_TIME = 150;
/** minimum duration for the toast */
export const DT_TOAST_MIN_DURATION = 2000;
/** Character limit for the toast */
export const DT_TOAST_CHAR_LIMIT = 120;
