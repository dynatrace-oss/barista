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

import { DtLogger, DtLoggerFactory } from '@dynatrace/barista-components/core';

const logger: DtLogger = DtLoggerFactory.create('DtChart');

// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-var
declare var require: any;
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const highcharts = require('highcharts');

export function applyHighchartsErrorHandler(): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  highcharts.error = function (code: number, stop: boolean): void {
    const message = `HighCharts Error: www.highcharts.com/errors/${code}`;
    logger.error(message);
    if (stop) {
      throw new Error(message);
    }
  };
}
