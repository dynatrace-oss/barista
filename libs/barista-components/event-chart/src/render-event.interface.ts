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

import {
  DtEventChartColors,
  DtEventChartEvent,
  DtEventChartField,
} from './event-chart-directives';

/**
 * Interface for the RenderEvent of the Event Chart
 */
export interface RenderEvent<T> {
  x1: number;
  x2: number;
  y: number;
  lane: string;
  color: DtEventChartColors;
  pattern: boolean;
  events: DtEventChartEvent<T>[];
  mergedWith?: number[];
  originalIndex?: number;
}

/**
 * Interface for the RenderField of the Event Chart
 */
export interface RenderField<T> {
  x1: number;
  x2: number;
  y: number;
  color: DtEventChartColors;
  fields: DtEventChartField<T>[];
  mergedWith?: number[];
  originalIndex?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isRenderEvent = (object: RenderEvent<any> | RenderField<any>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (<RenderEvent<any>>object).events !== undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isRenderField = (object: RenderEvent<any> | RenderField<any>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (<RenderField<any>>object).fields !== undefined;
};
