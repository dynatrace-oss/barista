/**
 * @license
 * Copyright 2019 Dynatrace LLC
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
  Constructor,
  MigrationRule,
  RuleUpgradeData,
} from '@angular/cdk/schematics';

export type NullableMigrationRule = Constructor<
  MigrationRule<RuleUpgradeData | null>
>;

/** Enum containing all target versions for the @dynatrace/barista-components package - add more if needed */
export enum DtTargetVersion {
  V5 = '5.0.0',
}

/** Extending the cdk's migration rule for now since the targetVersion is limited to angulars versioning */
export class DtMigrationRule extends MigrationRule<null> {
  /** The dynatrace angular components version */
  get dtTargetVersion(): DtTargetVersion {
    return (this.targetVersion as unknown) as DtTargetVersion;
  }
}
