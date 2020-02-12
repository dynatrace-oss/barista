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
import { chain, Rule, SchematicContext } from '@angular-devkit/schematics';
import {
  createUpgradeRule,
  RuleUpgradeData,
  TargetVersion,
} from '@angular/cdk/schematics';
import { green, yellow } from 'chalk';
import { DtTargetVersion } from './migration-rule';
import {
  LegacyImportsRule,
  removeCssSelectors,
  SecondaryEntryPointsRule,
} from './update-5.0.0';

/** Data that can be populated for each version upgrade with changes that can be done automatically */
const defaultUpgradeData: RuleUpgradeData = {
  attributeSelectors: {},
  classNames: {},
  constructorChecks: {},
  cssSelectors: {},
  elementSelectors: {},
  inputNames: {},
  methodCallChecks: {},
  outputNames: {},
  propertyNames: {},
};

/** Entry point for the migration schematics with target of Dynatrace Barista components v5 */
export function updateToV5(): Rule {
  return chain([
    removeCssSelectors(),
    createUpgradeRule(
      (DtTargetVersion.V5 as unknown) as TargetVersion,
      [SecondaryEntryPointsRule, LegacyImportsRule],
      defaultUpgradeData,
      onMigrationComplete,
    ),
  ]);
}

/** Function that will be called when the migration completed. */
function onMigrationComplete(
  _context: SchematicContext,
  targetVersion: TargetVersion,
  hasFailures: boolean,
): void {
  console.log(
    green(`\n  ✓  Updated Dynatrace Barista Components to ${targetVersion}\n`),
  );

  if (hasFailures) {
    console.log(
      yellow(
        `  ⚠  Some issues were detected but could not be fixed automatically. ` +
          `Please check the output above and fix these issues manually.`,
      ),
    );
  }
}
