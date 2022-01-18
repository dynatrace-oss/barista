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

import { Observable } from 'rxjs';
import { DtNodeDef } from './types';

export abstract class DtFilterFieldDataSource<T> {
  /**
   * Used by the DtFilterFieldControl. Called when it connects to the data source.
   * Should return a stream of data that will be transformed, filtered and
   * displayed by the DtFilterField and the DtFilterFieldControl.
   */
  abstract connect(): Observable<DtNodeDef<T> | null>;

  /** Used by the DtFilterField. Called when it is destroyed. */
  abstract disconnect(): void;

  /** Whether the provided data object can be transformed into an DtAutocompleteDef. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract isAutocomplete(data: any): boolean;

  /** Whether the provided data object can be transformed into an DtOptionDef. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract isOption(data: any): boolean;

  /** Whether the provided data object can be transformed into an DtGroupDef. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract isGroup(data: any): boolean;

  /** Whether the provided data object can be transformed into an DtFreeTextDef. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract isFreeText(data: any): boolean;

  /** Whether the provided data object can be transformed into an DtRangeDef. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract isRange(data: any): boolean;

  /** Whether the provided data object can be transformed into an DtMultiSelectDef. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract isMultiSelect(data: any): boolean;

  /** Transforms the provided data into a DtNodeDef which contains a DtAutocompleteDef. */
  abstract transformAutocomplete(
    data: T,
    parent: DtNodeDef<T> | null,
    existingDef: DtNodeDef<T> | null,
  ): DtNodeDef<T>;

  /** Transforms the provided data into a DtNodeDef which contains a DtOptionDef. */
  abstract transformOption(
    data: T,
    parentAutocompleteOrOption: DtNodeDef<T> | null,
    existingDef: DtNodeDef<T> | null,
  ): DtNodeDef<T>;

  /** Transforms the provided data into a DtNodeDef which contains a DtGroupDef. */
  abstract transformGroup(
    data: T,
    parentAutocomplete: DtNodeDef<T> | null,
    existingDef: DtNodeDef<T> | null,
  ): DtNodeDef<T>;

  /** Transforms the provided data into a DtNodeDef which contains a DtFreeTextDef. */
  abstract transformFreeText(
    data: T,
    parent: DtNodeDef<T> | null,
    existingDef: DtNodeDef<T> | null,
  ): DtNodeDef;

  /** Transforms the provided data into a DtNodeDef which contains a DtRangeDef. */
  abstract transformRange(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    parent: DtNodeDef<T> | null,
    existingDef: DtNodeDef<T> | null,
  ): DtNodeDef;

  /** Transforms the provided data into a DtNodeDef which contains a DtMultiSelectDef. */
  abstract transformMultiSelect(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    parent: DtNodeDef<T> | null,
    existingDef: DtNodeDef<T> | null,
  ): DtNodeDef;

  /** Transforms the provided data into a DtNodeDef. */
  abstract transformObject(
    data: T | null,
    parent: DtNodeDef<T> | null,
  ): DtNodeDef<T> | null;

  /** Transforms the provided list of data objects into an array of DtNodeDefs. */
  abstract transformList(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    list: any[],
    parent: DtNodeDef<T> | null,
  ): DtNodeDef<T>[];
}
