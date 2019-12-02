import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { join } from 'path';
import { Tree } from '@angular-devkit/schematics/src/tree/interface';

const testRunner = new SchematicTestRunner(
  '@dynatrace/barista-components/schematics',
  join(__dirname, '../collection.json'),
);

export async function runSchematic(
  schematicName: string,
  options: any,
  tree: Tree,
): Promise<UnitTestTree> {
  return testRunner.runSchematicAsync(schematicName, options, tree).toPromise();
}
