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

import { Constructor } from './constructor';
import { isDefined } from '../util';

/**
 * UniqueId counter, will be incremented with every
 * instatiation of the ExpandablePanel class
 */
let uniqueId = 0;

export interface HasId {
  /** Represents the unique id of the component. */
  id: string;
}

/** Mixin to augment a directive with a `id` property. */
// eslint-disable-next-line @typescript-eslint/ban-types
export function mixinId<T extends Constructor<{}>>(
  base: T,
  idPreset: string,
): Constructor<HasId> & T {
  return class extends base {
    /** Sets a unique id for the expandable section. */
    get id(): string {
      return this._id;
    }
    set id(value: string) {
      if (isDefined(value)) {
        this._id = value;
      } else {
        this._id = `${idPreset}-${uniqueId++}`;
      }
    }
    private _id = `${idPreset}-${uniqueId++}`;

    // eslint-disable-next-line
    constructor(...args: any[]) {
      super(...args); // eslint-disable-line
    }
  };
}
