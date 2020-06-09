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

import { Component } from '@angular/core';
import { Observable, concat } from 'rxjs';

import { SpacingService } from '../../services/spacing';
import { map, debounceTime, publish, take } from 'rxjs/operators';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'design-tokens-ui-spacings',
  templateUrl: './spacings.component.html',
  styleUrls: ['./spacings.component.scss'],
})
export class SpacingsComponent {
  /** @internal */
  _spacings$: Observable<KeyValue<string, string>[]>;

  constructor(private _spacingService: SpacingService) {
    // Spacings are unsorted here
    this._spacings$ = this._spacingService.spacings$.pipe(
      publish((value) =>
        concat(
          value.pipe(take(1)), // Make sure that the UI can be displayed immediately
          value.pipe(debounceTime(300)), // Debounce the following updates
        ),
      ),
      map(
        (spacings) =>
          Object.entries(spacings)
            .map(([key, value]) => ({ key, value }))
            .filter(({ key }) => key !== 'spacing--0'), // Editing the zero spacing wouldn't make sense
      ),
    );
  }

  /** @internal Export spacings as YAML */
  _yamlExport(): void {
    this._spacingService.exportYaml();
  }

  /** @internal */
  _modifySpacing(name: string, value: string): void {
    if (!isNaN(parseInt(value))) {
      // Avoid buggy UI updates if the input doesn't start with a number
      this._spacingService.modifySpacing(name, value);
    }
  }

  /** @internal */
  _getTokenDisplayName(name: string): string {
    return name.replace('spacing--', '');
  }

  /** @internal Angular trackBy function for avoiding loss of focus on changes */
  _trackSpacingKey(_index: number, item: KeyValue<string, string>): string {
    return item.key;
  }
}
