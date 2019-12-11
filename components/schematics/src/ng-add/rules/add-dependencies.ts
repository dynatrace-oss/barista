import { Rule, Tree } from '@angular-devkit/schematics';
import {
  addPkgJsonDependency,
  NodeDependency,
} from './add-package-json-dependency';
/**
 * Adds Dependencies to the package.json
 * Used to add library specific dependencies.
 * @param options from schema.d.ts
 */
export function addDependencies(
  dependencies: NodeDependency[],
  packageJsonPath: string,
): Rule {
  return (host: Tree) => {
    // if no dependencies are provided early exit
    if (!dependencies.length) {
      return host;
    }

    // loop over all dependencies and add them to the json.
    dependencies.forEach((dependency: NodeDependency) => {
      // add dependency to the package.json
      addPkgJsonDependency(host, dependency, packageJsonPath);
    });
    return host;
  };
}
