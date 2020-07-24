/**
 * @license
 * Copyright 2020 Dynatrace LLC
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
import {
  DtNodeDef,
  DtFilterFieldDataSource,
} from '@dynatrace/barista-components/filter-field';

export abstract class DtQuickFilterDataSource<T = any>
  implements DtFilterFieldDataSource<T> {
  /**
   * Used by the DtFilterFieldControl. Called when it connects to the data source.
   * Should return a stream of data that will be transformed, filtered and
   * displayed by the DtFilterField and the DtFilterFieldControl.
   */
  abstract connect(): Observable<DtNodeDef<T> | null>;

  /** Used by the DtFilterField. Called when it is destroyed. */
  abstract disconnect(): void;

  /** Whether the provided data object can be transformed into an DtAutocompleteDef. */
  abstract isAutocomplete(data: T): boolean;

  /** Whether the provided data object can be transformed into an DtOptionDef. */
  abstract isOption(data: T): boolean;

  /** Whether the provided data object can be transformed into an DtGroupDef. */
  abstract isGroup(data: T): boolean;

  /** Whether the provided data object can be transformed into an DtFreeTextDef. */
  abstract isFreeText(data: T): boolean;

  /** Whether the provided data object can be transformed into an DtRangeDef. */
  abstract isRange(data: T): boolean;

  /** Whether the provided data object can be transformed into an DtMultiSelectDef. */
  abstract isMultiSelect(data: T): boolean;

  /** A function that receives each node and needs to return whether the given node should be shown in the sidebar */
  abstract showInSidebarFunction = (_node: any): boolean => true;

  /** Transforms the provided data into a DtNodeDef which contains a DtAutocompleteDef. */
  abstract transformAutocomplete(
    data: T,
    parent: DtNodeDef | null,
    existingDef: DtNodeDef | null,
  ): DtNodeDef<T>;

  /** Transforms the provided data into a DtNodeDef which contains a DtOptionDef. */
  abstract transformOption(
    data: T,
    parentAutocompleteOrOption: DtNodeDef | null,
    existingDef: DtNodeDef | null,
  ): DtNodeDef<T>;

  /** Transforms the provided data into a DtNodeDef which contains a DtGroupDef. */
  abstract transformGroup(
    data: T,
    parentAutocomplete: DtNodeDef | null,
    existingDef: DtNodeDef | null,
  ): DtNodeDef<T>;

  /** Transforms the provided data into a DtNodeDef which contains a DtFreeTextDef. */
  abstract transformFreeText(
    data: T,
    parent: DtNodeDef | null,
    existingDef: DtNodeDef | null,
  ): DtNodeDef<T>;

  /** Transforms the provided data into a DtNodeDef which contains a DtRangeDef. */
  abstract transformRange(
    data: T,
    parent: DtNodeDef | null,
    existingDef: DtNodeDef | null,
  ): DtNodeDef<T>;

  /** Transforms the provided data into a DtNodeDef which contains a DtMultiSelectDef. */
  abstract transformMultiSelect(
    data: T,
    parent: DtNodeDef | null,
    existingDef: DtNodeDef | null,
  ): DtNodeDef<T>;

  /** Transforms the provided data into a DtNodeDef. */
  abstract transformObject(
    data: T | null,
    parent: DtNodeDef | null,
  ): DtNodeDef<T> | null;

  /** Transforms the provided list of data objects into an array of DtNodeDefs. */
  abstract transformList(list: T[], parent: DtNodeDef | null): DtNodeDef<T>[];
}
