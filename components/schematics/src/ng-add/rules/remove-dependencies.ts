import { Rule, Tree } from '@angular-devkit/schematics';
import { NodeDependencyType } from './add-package-json-dependency';
import { readJsonFromTree, findJsonPropertyInAst } from '../../utils';
/**
 * Adds Dependencies to the package.json
 * Used to add library specific dependencies.
 * @param options from schema.d.ts
 */
export function removeDependencies(
  dependencies: string[],
  packageJsonPath: string,
): Rule {
  return (host: Tree) => {
    // if no dependencies are provided early exit
    if (!dependencies.length) {
      return host;
    }

    // loop over all dependencies and add them to the json.
    dependencies.forEach((dependency: string) => {
      // add dependency to the package.json
      removeDependency(host, dependency, packageJsonPath);
    });
    return host;
  };
}

function removeDependency(tree: Tree, dependency: string, path: string): void {
  const packageJsonAst = readJsonFromTree(tree, path);
  const depsNode = findJsonPropertyInAst(
    packageJsonAst,
    NodeDependencyType.Default,
  );

  if (depsNode && depsNode.kind === 'object') {
    for (const property of depsNode.properties) {
      if (property.key.text === `"${dependency}"`) {
        const recorder = tree.beginUpdate(path);
        const { end, start } = property;
        recorder.remove(start.offset, end.offset - start.offset);
        tree.commitUpdate(recorder);
      }
    }
  }
}
