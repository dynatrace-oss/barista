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

import {
  DependencyGraph,
  DependencyGraphNodeIdentifier,
} from './dependency-graph';

const tokenIdentifier: DependencyGraphNodeIdentifier = {
  name: 'fluid-button--spacing',
  type: 'token',
};

const aliasIdentifier: DependencyGraphNodeIdentifier = {
  name: 'fluid-spacing-0',
  type: 'alias',
};

const componentIdentifier: DependencyGraphNodeIdentifier = {
  name: 'fluid-button',
  type: 'component',
};

describe('DtTokenDependencyGraph', () => {
  let graph: DependencyGraph;

  beforeEach(() => {
    graph = new DependencyGraph();
  });

  describe('Adding dependencies', () => {
    beforeEach(() => {
      graph.addDependency(tokenIdentifier, aliasIdentifier);
    });

    test('if the nodes are created if they do not exist', () => {
      expect(graph.hasNode(tokenIdentifier)).toBeTruthy();
      expect(graph.hasNode(aliasIdentifier)).toBeTruthy();
    });

    test('if dependency is created correctly on the alias.', () => {
      // Token should not have dependencies yet
      expect(graph.getNode(tokenIdentifier)).toMatchSnapshot();
      // Alias should already have dependencies.
      expect(graph.getNode(aliasIdentifier)).toMatchSnapshot();
    });

    test('if dependency is not duplicated if connected multiple times', () => {
      // Add the dependency a second time, it should only be reflected once.
      graph.addDependency(tokenIdentifier, aliasIdentifier);
      // Token should not have dependencies yet
      expect(graph.getNode(tokenIdentifier)).toMatchSnapshot();
      // Alias should already have dependencies.
      expect(graph.getNode(aliasIdentifier)).toMatchSnapshot();
    });
  });

  describe('get node by types', () => {
    beforeEach(() => {
      graph.addDependency(tokenIdentifier, aliasIdentifier);
    });

    test('get nodes by alias type', () => {
      expect(graph.getNodesByType('alias')).toHaveLength(1);
    });

    test('get nodes by token type', () => {
      expect(graph.getNodesByType('token')).toHaveLength(1);
    });

    test('get empty list for non defined tokens yet', () => {
      expect(graph.getNodesByType('component')).toHaveLength(0);
    });

    test('get nodes by components type', () => {
      graph.addDependency(componentIdentifier, tokenIdentifier);
      expect(graph.getNodesByType('component')).toHaveLength(1);
    });
  });

  describe('has node checks', () => {
    beforeEach(() => {
      graph.addDependency(tokenIdentifier, aliasIdentifier);
      graph.addDependency(componentIdentifier, tokenIdentifier);
    });

    test('if the alias node can be gotten', () => {
      expect(graph.getNode(aliasIdentifier)).toMatchObject({
        name: aliasIdentifier.name,
        type: aliasIdentifier.type,
        dependencies: expect.any(Array),
      });
    });

    test('if the token node can be gotten', () => {
      expect(graph.getNode(tokenIdentifier)).toMatchObject({
        name: tokenIdentifier.name,
        type: tokenIdentifier.type,
        dependencies: expect.any(Array),
      });
    });

    test('if the component node can be gotten', () => {
      expect(graph.getNode(componentIdentifier)).toMatchObject({
        name: componentIdentifier.name,
        type: componentIdentifier.type,
        dependencies: expect.any(Array),
      });
    });

    test('if the no error is thrown when node is not found', () => {
      expect(
        graph.getNode({
          type: 'component',
          name: 'non-existing-component',
        }),
      ).toBeNull();
    });
  });

  describe('Serialization', () => {
    beforeEach(() => {
      graph.addDependency(tokenIdentifier, aliasIdentifier);
      graph.addDependency(componentIdentifier, tokenIdentifier);
    });

    test('graph should serialize correctly', () => {
      expect(graph.serialize()).toMatchSnapshot();
    });
  });

  describe('Deserialization', () => {
    beforeEach(() => {
      const serializedDependencyGraph = `
  [
    [
      "fluid-button--spacing",
      {
        "name": "fluid-button--spacing",
        "type": "token",
        "dependencies": [
          {
            "name": "fluid-button",
            "type": "component",
            "dependencies": []
          }
        ]
      }
    ],
    [
      "fluid-spacing-0",
      {
        "name": "fluid-spacing-0",
        "type": "alias",
        "dependencies": [
          {
            "name": "fluid-button--spacing",
            "type": "token",
            "dependencies": [
              {
                "name": "fluid-button",
                "type": "component",
                "dependencies": []
              }
            ]
          }
        ]
      }
    ],
    [
      "fluid-button",
      {
        "name": "fluid-button",
        "type": "component",
        "dependencies": []
      }
    ]
  ]
      `;
      graph.deserialize(serializedDependencyGraph);
    });

    test('if the alias node is added', () => {
      expect(graph.getNode(aliasIdentifier)).not.toBeNull();
    });
    test('if the token node is added', () => {
      expect(graph.getNode(tokenIdentifier)).not.toBeNull();
    });
    test('if the component node is added', () => {
      expect(graph.getNode(componentIdentifier)).not.toBeNull();
    });
    test('if dependencies have been deserialized correctly', () => {
      expect(graph.getNode(aliasIdentifier)).toMatchSnapshot();
      expect(graph.getNode(tokenIdentifier)).toMatchSnapshot();
      expect(graph.getNode(componentIdentifier)).toMatchSnapshot();
    });
  });

  describe('DOT output', () => {
    // TODO: Actually write dot output
  });
});
