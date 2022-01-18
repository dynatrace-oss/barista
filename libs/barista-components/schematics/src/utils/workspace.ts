/* eslint-disable no-redeclare */
/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

import { Tree, Rule } from '@angular-devkit/schematics';
import { workspaces } from '@angular-devkit/core';
import { readFileFromTree } from './read-file-from-tree';

function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {
    async readFile(path: string): Promise<string> {
      return readFileFromTree(tree, path);
    },
    async writeFile(path: string, data: string): Promise<void> {
      return tree.overwrite(path, data);
    },
    async isDirectory(path: string): Promise<boolean> {
      // approximate a directory check
      return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
    },
    async isFile(path: string): Promise<boolean> {
      return tree.exists(path);
    },
  };
}

/** Get the angular workspace out of the tree */
export async function getWorkspace(
  tree: Tree,
  path = '/',
): Promise<workspaces.WorkspaceDefinition> {
  const host = createHost(tree);
  const { workspace } = await workspaces.readWorkspace(path, host);
  return workspace;
}

export function updateWorkspace(
  updater: (
    workspace: workspaces.WorkspaceDefinition,
  ) => void | PromiseLike<void>,
): Rule;

export function updateWorkspace(
  workspace: workspaces.WorkspaceDefinition,
): Rule;

export function updateWorkspace(
  updaterOrWorkspace:
    | workspaces.WorkspaceDefinition
    | ((workspace: workspaces.WorkspaceDefinition) => void | PromiseLike<void>),
): Rule {
  return async (tree: Tree) => {
    const host = createHost(tree);

    if (typeof updaterOrWorkspace === 'function') {
      const { workspace } = await workspaces.readWorkspace('/', host);

      const result = updaterOrWorkspace(workspace);
      if (result !== undefined) {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await result;
      }

      await workspaces.writeWorkspace(workspace, host);
    } else {
      await workspaces.writeWorkspace(updaterOrWorkspace, host);
    }
  };
}
