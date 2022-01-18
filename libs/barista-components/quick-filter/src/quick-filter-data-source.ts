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

import { DtFilterFieldDataSource } from '@dynatrace/barista-components/filter-field';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class DtQuickFilterDataSource<T = any>
  extends DtFilterFieldDataSource<T>
  implements DtFilterFieldDataSource<T>
{
  /** Function that evaluates if a node should be displayed in the quick filter sidebar */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showInSidebarFunction: (node: any) => boolean;
}
