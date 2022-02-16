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
import { SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { isObject } from './type-util';

/** Sanitizes a nested object or string from malicious html code  */
export const sanitize = <T extends {} | string>(
  option: T,
  sanitizer: DomSanitizer,
): T => {
  if (typeof option === 'string') {
    return sanitizer.sanitize(SecurityContext.HTML, option) as T;
  }

  if (option && isObject(option)) {
    Object.keys(option).forEach((key) => {
      if (typeof option[key] === 'string') {
        option[key] = sanitizer.sanitize(SecurityContext.HTML, option[key]);
      } else if (Array.isArray(option[key])) {
        option[key].forEach((item, i) => {
          option[key][i] = sanitize(item, sanitizer);
        });
      } else if (typeof option[key] === 'object') {
        option[key] = sanitize(option[key], sanitizer);
      }
    });
  }
  return option;
};
