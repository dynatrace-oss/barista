import {
  Constructor,
  MigrationRule,
  RuleUpgradeData,
} from '@angular/cdk/schematics';

export type NullableMigrationRule = Constructor<
  MigrationRule<RuleUpgradeData | null>
>;

/** Enum containing all target versions for the @dynatrace/angular-components package - add more if needed */
export enum DtTargetVersion {
  V5 = 'version 5',
}

/** Extending the cdk's migration rule for now since the targetVersion is limited to angulars versioning */
export class DtMigrationRule extends MigrationRule<null> {
  /** The dynatrace angular components version */
  get dtTargetVersion(): DtTargetVersion {
    return (this.targetVersion as unknown) as DtTargetVersion;
  }
}
