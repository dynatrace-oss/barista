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
  DtFilterFieldDefaultDataSource,
  DtFilterFieldDefaultDataSourceAutocomplete,
  DtFilterFieldDefaultDataSourceFreeText,
  DtFilterFieldDefaultDataSourceGroup,
  DtFilterFieldDefaultDataSourceRange,
  DtFilterFieldDefaultDataSourceSimpleGroup,
} from '@dynatrace/barista-components/filter-field';
import { DtQuickFilterDataSource } from './quick-filter-data-source';

export interface DtQuickFilterDefaultDataSourceSimpleOption {
  name: string;
  id?: string | number;
}

export type DtQuickFilterDefaultDataSourceRange =
  DtFilterFieldDefaultDataSourceRange;
export type DtQuickFilterDefaultDataSourceFreeText =
  DtFilterFieldDefaultDataSourceFreeText;
export type DtQuickFilterDefaultDataSourceAutocomplete =
  DtFilterFieldDefaultDataSourceAutocomplete;
export type DtQuickFilterDefaultDataSourceGroup =
  DtFilterFieldDefaultDataSourceGroup;
export type DtQuickFilterDefaultDataSourceSimpleGroup =
  DtFilterFieldDefaultDataSourceSimpleGroup;
export type DtQuickFilterDefaultDataSourceType =
  | DtQuickFilterDefaultDataSourceOption
  | DtQuickFilterDefaultDataSourceGroup
  | DtQuickFilterDefaultDataSourceAutocomplete
  | DtQuickFilterDefaultDataSourceFreeText
  | DtQuickFilterDefaultDataSourceRange;
export type DtQuickFilterDefaultDataSourceOption =
  | DtQuickFilterDefaultDataSourceSimpleOption
  | (DtQuickFilterDefaultDataSourceAutocomplete &
      DtQuickFilterDefaultDataSourceSimpleOption)
  | (DtQuickFilterDefaultDataSourceFreeText &
      DtQuickFilterDefaultDataSourceSimpleOption)
  | (DtQuickFilterDefaultDataSourceRange &
      DtQuickFilterDefaultDataSourceSimpleOption);
export interface DtQuickFilterDefaultDataSourceConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showInSidebar?: (node: any) => boolean;
}

export class DtQuickFilterDefaultDataSource<
    T extends DtQuickFilterDefaultDataSourceType,
  >
  extends DtFilterFieldDefaultDataSource
  implements DtQuickFilterDataSource
{
  constructor(
    initialData: T = null as unknown as T,
    config: DtQuickFilterDefaultDataSourceConfig = {},
  ) {
    super(initialData);
    this.showInSidebarFunction = config?.showInSidebar || (() => true);
  }

  /** Function that evaluates if a node should be displayed in the quick filter sidebar */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showInSidebarFunction: (node: any) => boolean;
}
