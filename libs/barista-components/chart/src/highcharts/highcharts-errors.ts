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

import * as highcharts from 'highcharts';

export function applyHighchartsErrorHandler(): void {
  // ng-packagr starting with v13 is outputting mjs files. We needed to replace
  // the require with an import. To override these read only functions properly,
  // we needed to cast highcharts as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (highcharts as any).error = function (code: number, stop: boolean): void {
    const message = `HighCharts Error: www.highcharts.com/errors/${code}`;
    logger.error(message);
    if (stop) {
      throw new Error(message);
    }
  };
}
