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
import { ClientFunction } from 'testcafe';

declare const window: Window & { ng: any; getAllAngularRootElements: any };

export const waitForAngular = ClientFunction((waitTimeout = 10000) => {
  /** Interval in milliseconds where to ping angular */
  const PING_INTERVAL = 500;

  return new Promise<void | Error>((resolve, reject) => {
    let pingIntervalId: number;
    let pingTimeoutId: number;

    const clearTimeouts = () => {
      window.clearTimeout(pingTimeoutId);
      window.clearInterval(pingIntervalId);
    };

    const isThereAngularInDevelopmentMode = () => {
      if (
        window.ng &&
        typeof window.ng.getComponent === 'function' &&
        typeof window.getAllAngularRootElements === 'function'
      ) {
        const rootElements = window.getAllAngularRootElements();
        const firstRootDebugElement = rootElements?.length
          ? window.ng.getComponent(rootElements[0])
          : null;

        return !!firstRootDebugElement;
      }

      return false;
    };

    const check = () => {
      if (isThereAngularInDevelopmentMode()) {
        clearTimeouts();
        resolve();
      }
    };

    pingTimeoutId = window.setTimeout(() => {
      clearTimeouts();
      reject(new Error('Cannot find Angular in development mode.'));
    }, waitTimeout);

    check();
    pingIntervalId = window.setInterval(check, PING_INTERVAL);
  });
});
