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

import { DependencyGraph } from './dependency-graph';
import { processTokenFile } from './add-tokens-to-alias-dependencies';
import { DesignTokenSource } from '../interfaces/design-token-source';

describe('DesignTokenSource dependency analyzer', () => {
  let graph: DependencyGraph;

  beforeEach(() => {
    graph = new DependencyGraph();
  });

  test('if file with a single prop with single values is processed correctly', () => {
    const file: DesignTokenSource = {
      props: [
        {
          name: 'fluid-button-spacing',
          value: '{!fluid-spacing-0}',
        },
      ],
    };
    processTokenFile(graph, file);
    expect(
      graph.getNode({ name: 'fluid-button-spacing', type: 'token' }),
    ).not.toBeNull();
    expect(
      graph.getNode({ name: 'fluid-spacing-0', type: 'alias' }),
    ).not.toBeNull();
  });

  test('if file with multiple props with single values is processed correctly', () => {
    const file: DesignTokenSource = {
      props: [
        {
          name: 'fluid-button-spacing',
          value: '{!fluid-spacing-0}',
        },
        {
          name: 'fluid-button-background',
          value: '{!fluid-palette-key-100}',
        },
      ],
    };
    processTokenFile(graph, file);
    expect(
      graph.getNode({ name: 'fluid-button-spacing', type: 'token' }),
    ).not.toBeNull();
    expect(
      graph.getNode({ name: 'fluid-spacing-0', type: 'alias' }),
    ).not.toBeNull();
    expect(
      graph.getNode({ name: 'fluid-button-background', type: 'token' }),
    ).not.toBeNull();
    expect(
      graph.getNode({ name: 'fluid-palette-key-100', type: 'alias' }),
    ).not.toBeNull();
  });

  test('if file with a single prop with multi value values is processed correctly', () => {
    const file: DesignTokenSource = {
      props: [
        {
          name: 'fluid-button-spacing',
          value: '{!fluid-spacing-0} {!fluid-spacing-small}',
        },
      ],
    };
    processTokenFile(graph, file);
    expect(
      graph.getNode({ name: 'fluid-button-spacing', type: 'token' }),
    ).not.toBeNull();
    expect(
      graph.getNode({ name: 'fluid-spacing-0', type: 'alias' }),
    ).not.toBeNull();
    expect(
      graph.getNode({ name: 'fluid-spacing-small', type: 'alias' }),
    ).not.toBeNull();
  });

  test('if the prop is correctly processed if it holds multiple values', () => {
    const file: DesignTokenSource = {
      props: [
        {
          name: 'fluid-button-spacing',
          value: {
            spacingX: '{!fluid-spacing-0}',
            spacingY: '{!fluid-spacing-small}',
          },
        },
      ],
    };
    processTokenFile(graph, file);
    expect(
      graph.getNode({ name: 'fluid-button-spacing', type: 'token' }),
    ).not.toBeNull();
    expect(
      graph.getNode({ name: 'fluid-spacing-0', type: 'alias' }),
    ).not.toBeNull();
    expect(
      graph.getNode({ name: 'fluid-spacing-small', type: 'alias' }),
    ).not.toBeNull();
  });
});
