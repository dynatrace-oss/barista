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

/** Defines the Type of a dependencyGraph Node */
export type DependencyGraphDependencyType =
  | 'alias'
  | 'token'
  | 'custom-property'
  | 'sass-variable'
  | 'component';

/** Interface to uniquely identify a DependencyGraphNode */
export interface DependencyGraphNodeIdentifier {
  type: DependencyGraphDependencyType;
  name: string;
}

/** A single dependency graph node */
export class DependencyGraphNode {
  constructor(
    public name: string,
    public type: DependencyGraphDependencyType,
  ) {}

  dependencies: DependencyGraphNode[] = [];
}

/** Creates all connections for a node in dot notation recursively. */
// export function generateDotConnections(node: DependencyGraphNode): string[] {
//   const connections = [];

//   return connections;
// }

/** DependencyGraph class to handle all connections between DependencyGraphNodes. */
export class DependencyGraph {
  private _nodes = new Map<string, DependencyGraphNode>();

  /** Get or create a token by a token identifier. */
  private getOrCreateNode(
    identifier: DependencyGraphNodeIdentifier,
  ): DependencyGraphNode {
    let identifiedToken: DependencyGraphNode;
    if (this._nodes.has(identifier.name)) {
      identifiedToken = this._nodes.get(identifier.name)!;
    } else {
      identifiedToken = new DependencyGraphNode(
        identifier.name,
        identifier.type,
      );
      this._nodes.set(identifier.name, identifiedToken);
    }
    return identifiedToken;
  }

  /**
   * Adds a dependency connection to the list of tokens
   * @param tokenIdentifier - Identifies the current token. It adds the token
   * to the map, if it does not exist.
   * @param tokenDependency - Identifies a token, that the identified token has
   * a dependency to.
   */
  addDependency(
    tokenIdentifier: DependencyGraphNodeIdentifier,
    tokenDependency: DependencyGraphNodeIdentifier,
  ): void {
    const identifiedToken = this.getOrCreateNode(tokenIdentifier);
    const dependentToken = this.getOrCreateNode(tokenDependency);

    // Check if the depdendency alreay exists for some reason.
    const containsDependencyAlready = dependentToken.dependencies.some(
      (dependencyToken) => dependencyToken === identifiedToken,
    );
    if (!containsDependencyAlready) {
      dependentToken.dependencies.push(identifiedToken);
    }
  }

  /** Get all registered tokens by their token type. */
  getNodesByType(type: DependencyGraphDependencyType): DependencyGraphNode[] {
    return Array.from(this._nodes.values()).filter(
      (node: DependencyGraphNode) => node.type === type,
    );
  }

  /** Checks if the dependency graphs knows of a specific token and type */
  hasNode(identifier: DependencyGraphNodeIdentifier): boolean {
    const tokensInType = this.getNodesByType(identifier.type);
    const foundToken = tokensInType.find(
      (token) => token.name === identifier.name,
    );
    return Boolean(foundToken);
  }

  /** Get a specific node from the node list */
  getNode(
    identifier: DependencyGraphNodeIdentifier,
  ): DependencyGraphNode | null {
    if (
      this._nodes.has(identifier.name) &&
      this._nodes.get(identifier.name)?.type === identifier.type
    ) {
      return this._nodes.get(identifier.name)!;
    }
    return null;
  }

  /** Serializes the dependency tree nodes. */
  serialize(): string {
    return JSON.stringify(Array.from(this._nodes), null, 2);
  }

  /** Deserializes the dependency tree nodes. */
  deserialize(_dependencyGraphString: string): void {
    const parsedData = JSON.parse(_dependencyGraphString);
    for (const [name, rootNode] of parsedData) {
      const rootNodeIdentifier: DependencyGraphNodeIdentifier = {
        name: name,
        type: rootNode.type,
      };
      // Make sure that the root node exists
      this.getOrCreateNode(rootNodeIdentifier);
      if (rootNode.dependencies) {
        for (const dependency of rootNode.dependencies) {
          const dependencyIdentifier: DependencyGraphNodeIdentifier = {
            name: dependency.name,
            type: dependency.type,
          };
          this.addDependency(dependencyIdentifier, rootNodeIdentifier);
        }
      }
    }
  }

  /**
   * Converts the dependency graph to a DOT format
   * https://graphviz.gitlab.io/_pages/doc/info/lang.html
   */
  convertToDotGraph(): string {
    const graph: string[] = ['digraph "token-dependencies" {'];

    for (const node of this._nodes.values()) {
      for (const dependency of node.dependencies) {
        graph.push(`"${node.name}" -> "${dependency.name}";`);
      }
    }
    graph.push('}');
    return graph.join('\n');
  }
}
