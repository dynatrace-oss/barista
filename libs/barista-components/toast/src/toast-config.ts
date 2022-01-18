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
