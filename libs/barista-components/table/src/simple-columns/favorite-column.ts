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

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Optional,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { DtTable } from '../table';
import { DtSimpleColumnBase } from './simple-column-base';

@Component({
  selector: 'dt-favorite-column',
  templateUrl: 'favorite-column.html',
  styleUrls: ['./favorite-column.scss'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.Emulated,
  /*
   * Deliberatley set to Default because the embedded view that gets created for the
   * dtColumDef can't handle onPush and results in ChangeAfterChecked error.
   */
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [{ provide: DtSimpleColumnBase, useExisting: DtFavoriteColumn }],
})
export class DtFavoriteColumn<T> extends DtSimpleColumnBase<T> {
  /** Event that is emitted whenever the star icon for the favorite column is toggled. */
  @Output() readonly favoriteToggled = new EventEmitter<T>();

  constructor(@Optional() table: DtTable<T>) {
    super(table);
  }

  /**
   * @internal is Favorite returns whether the column specified by name in the datasource
   * holds true or false.
   */
  _isFavorite(data: T): boolean {
    return this.displayAccessor
      ? this.displayAccessor(data, this.name)
      : (data as any)[this.name]; // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  /**
   * @internal Toggle Favorite toggles the value of the favorite column in the
   * datasource using the predefined name.
   */
  _toggleFavorite(data: T): void {
    this.favoriteToggled.emit(data);
  }
}
