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

import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { map } from 'rxjs/operators';
import { stringify } from 'yaml';

import * as spacingAliases from '@dynatrace/fluid-design-tokens-meta/aliases/spacing.alias';
import { FluidKeyValueTokens } from '@dynatrace/shared/barista-definitions';
import { StatefulServiceBase } from '../stateful-service';
import { downloadStringAsTextFile } from '../../utils/download';

const YAML_FILE_NAME = 'spacing.alias.yml';

interface State {
  spacingAliases: FluidKeyValueTokens;
}

// Selectors
export const getSpacings = (state: State) => state.spacingAliases;

@Injectable({
  providedIn: 'root',
})
export class SpacingService extends StatefulServiceBase<State> {
  spacings$ = this.state$.pipe(map(getSpacings));

  constructor() {
    super();

    // Deep copy the palette source to avoid mutating the imported object
    const spacingTokens = cloneDeep((spacingAliases as any).default);

    const initialState = {
      spacingAliases: spacingTokens.aliases,
    };

    this.modifyState(() => initialState);
  }

  /** Sets the spacing with the given name to the new value */
  modifySpacing(name: string, newValue: string): void {
    this.modifyState((state) => {
      const aliases = { ...state.spacingAliases };
      aliases[name] = newValue;

      return { ...state, spacingAliases: aliases };
    });
  }

  /** Exports all palettes as a YAML file */
  exportYaml(): void {
    const spacings = this.selectState((state) => state.spacingAliases);

    const yaml = stringify({
      aliases: spacings,
    });

    downloadStringAsTextFile(YAML_FILE_NAME, yaml);
  }
}
