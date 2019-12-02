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

import { Tree } from '@angular-devkit/schematics';
import {
  appendPropertyInJsonAst,
  findJsonPropertyInAst,
  insertPropertyInJsonAst,
  readJsonFromTree,
} from '../../utils';
import { PackageJsonDependencyType } from '../../interfaces/package-json.interface';

const INDENT_SIZE = 2;
const PKG_JSON_DEFAULT_PATH = '/package.json';

export interface NodeDependency {
  name: string;
  version: string;
  type?: PackageJsonDependencyType;
  overwrite?: boolean;
}

export function addPkgJsonDependency(
  tree: Tree,
  dependency: NodeDependency,
  path: string,
): void {
  const dependencyType = dependency.type || PackageJsonDependencyType.Default;
  const packageJsonAst = readJsonFromTree(tree, path);
  const depsNode = findJsonPropertyInAst(packageJsonAst, dependencyType);
  const recorder = tree.beginUpdate(path || PKG_JSON_DEFAULT_PATH);
  if (!depsNode) {
    // Haven't found the dependencies key, add it to the root of the package.json.
    appendPropertyInJsonAst(
      recorder,
      packageJsonAst,
      dependencyType,
      { [dependency.name]: dependency.version },
      INDENT_SIZE,
    );
  } else if (depsNode.kind === 'object') {
    // check if package already added
    const depNode = findJsonPropertyInAst(depsNode, dependency.name);

    if (!depNode) {
      // Package not found, add it.
      insertPropertyInJsonAst(
        recorder,
        depsNode,
        dependency.name,
        dependency.version,
        INDENT_SIZE * 2,
      );
    } else if (dependency.overwrite) {
      // Package found, update version if overwrite.
      const { end, start } = depNode;
      recorder.remove(start.offset, end.offset - start.offset);
      recorder.insertRight(start.offset, JSON.stringify(dependency.version));
    }
  }

  tree.commitUpdate(recorder);
}

export function getPkgJsonDependency(
  tree: Tree,
  name: string,
  path: string,
): NodeDependency | null {
  const pkgJson = readJsonFromTree(tree, path);
  let dep: NodeDependency | null = null;
  [
    PackageJsonDependencyType.Default,
    PackageJsonDependencyType.Dev,
    PackageJsonDependencyType.Optional,
    PackageJsonDependencyType.Peer,
  ].forEach(depType => {
    if (dep !== null) {
      return;
    }

    const depsNode = findJsonPropertyInAst(pkgJson, depType);
    if (depsNode !== null && depsNode.kind === 'object') {
      const depNode = findJsonPropertyInAst(depsNode, name);
      if (depNode !== null && depNode.kind === 'string') {
        const version = depNode.value;
        dep = {
          type: depType,
          name,
          version,
        };
      }
    }
  });

  return dep;
}
