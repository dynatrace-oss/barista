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

import { createSourceFile, ScriptTarget } from 'typescript';
import {
  getCustomElementsFromSourceFile,
  findUsedStylesInComponentClass,
  processScssFile,
} from './add-component-dependencies';
import { DependencyGraph } from './dependency-graph';

describe('Components token dependency analyzer', () => {
  describe('getCustomElementsFromSourceFile', () => {
    test('if the single component class can be found', () => {
      const componentSourceFile = createSourceFile(
        'mockComponent.ts',
        `class FluidButton extends LitElement {} `,
        ScriptTarget.ES2015,
      );
      const foundClasses = getCustomElementsFromSourceFile(componentSourceFile);
      expect(foundClasses).toHaveLength(1);
      expect(foundClasses[0].name?.text).toBe('FluidButton');
    });

    test('if the multiple component classes can be found', () => {
      const componentSourceFile = createSourceFile(
        'mockComponent.ts',
        `
class FluidButton extends LitElement {}

class FluidButtonInset extends LitElement {}

class FluidButtonPostfix extends LitElement {}

`,
        ScriptTarget.ES2015,
      );
      const foundClasses = getCustomElementsFromSourceFile(componentSourceFile);
      expect(foundClasses).toHaveLength(3);
      expect(foundClasses[0].name?.text).toBe('FluidButton');
      expect(foundClasses[1].name?.text).toBe('FluidButtonInset');
      expect(foundClasses[2].name?.text).toBe('FluidButtonPostfix');
    });

    test('if classes that are not component classes are not picked up', () => {
      const componentSourceFile = createSourceFile(
        'mockComponent.ts',
        `
class FluidButton extends LitElement {}

class CustomSomeclass {}

class FluidButtonPostfix extends LitElement {}

      `,
        ScriptTarget.ES2015,
      );
      const foundClasses = getCustomElementsFromSourceFile(componentSourceFile);
      expect(foundClasses).toHaveLength(2);
      expect(foundClasses[0].name?.text).toBe('FluidButton');
      expect(foundClasses[1].name?.text).toBe('FluidButtonPostfix');
    });
  });

  describe('find used styles from component classes', () => {
    test('if single style is found in getter', () => {
      const componentSourceFile = createSourceFile(
        'mockComponent.ts',
        `
class FluidButton extends LitElement {
  static get styles(): CSSResult {
    return styles;
  }
}
      `,
        ScriptTarget.ES2015,
      );
      const componentClass = getCustomElementsFromSourceFile(
        componentSourceFile,
      )[0]!;
      expect(findUsedStylesInComponentClass(componentClass)).toEqual([
        'styles',
      ]);
    });

    test('if style array is found in getter', () => {
      const componentSourceFile = createSourceFile(
        'mockComponent.ts',
        `
class FluidButton extends LitElement {
  static get styles(): CSSResult {
    return [style1, style2];
  }
}
      `,
        ScriptTarget.ES2015,
      );
      const componentClass = getCustomElementsFromSourceFile(
        componentSourceFile,
      )[0]!;
      expect(findUsedStylesInComponentClass(componentClass)).toEqual([
        'style1',
        'style2',
      ]);
    });

    test('if single style is found in property', () => {
      const componentSourceFile = createSourceFile(
        'mockComponent.ts',
        `
class FluidButton extends LitElement {
  static styles = styles;
}
      `,
        ScriptTarget.ES2015,
      );
      const componentClass = getCustomElementsFromSourceFile(
        componentSourceFile,
      )[0]!;
      expect(findUsedStylesInComponentClass(componentClass)).toEqual([
        'styles',
      ]);
    });

    test('if style array is found in getter', () => {
      const componentSourceFile = createSourceFile(
        'mockComponent.ts',
        `
class FluidButton extends LitElement {
  static styles = [style1, style2];
}
      `,
        ScriptTarget.ES2015,
      );
      const componentClass = getCustomElementsFromSourceFile(
        componentSourceFile,
      )[0]!;
      expect(findUsedStylesInComponentClass(componentClass)).toEqual([
        'style1',
        'style2',
      ]);
    });

    test('if it does not fail when no styles are present', () => {
      const componentSourceFile = createSourceFile(
        'mockComponent.ts',
        `
class FluidButton extends LitElement {}
      `,
        ScriptTarget.ES2015,
      );
      const componentClass = getCustomElementsFromSourceFile(
        componentSourceFile,
      )[0]!;
      expect(findUsedStylesInComponentClass(componentClass)).toEqual([]);
    });
  });

  describe('find dependencies in scss files', () => {
    let graph: DependencyGraph;

    beforeEach(() => {
      graph = new DependencyGraph();
      graph.addDependency(
        {
          name: 'fluid-button--padding-small',
          type: 'token',
        },
        {
          name: 'fluid-spacing-small',
          type: 'alias',
        },
      );
    });

    test('should find single sass variable used', () => {
      const scssSource = `
:host {
  --fluid-button--padding: #{$fluid-button--padding-small};
}
`;
      processScssFile(graph, scssSource, 'FluidButton');
      const tokenNode = graph.getNode({
        type: 'token',
        name: 'fluid-button--padding-small',
      });
      expect(tokenNode).not.toBeNull();
      expect(tokenNode?.dependencies).toHaveLength(1);

      expect(
        graph.getNode({
          type: 'component',
          name: 'FluidButton',
        }),
      ).toMatchObject({
        name: 'FluidButton',
        type: 'component',
        dependencies: expect.any(Array),
      });
    });

    test('should find single custom property used', () => {
      const scssSource = `
:host {
  --fluid-button--padding: var(--fluid-button--padding-small);
}
`;
      processScssFile(graph, scssSource, 'FluidButton');
      const tokenNode = graph.getNode({
        type: 'token',
        name: 'fluid-button--padding-small',
      });
      expect(tokenNode).not.toBeNull();
      expect(tokenNode?.dependencies).toHaveLength(1);

      expect(
        graph.getNode({
          type: 'component',
          name: 'FluidButton',
        }),
      ).toMatchObject({
        name: 'FluidButton',
        type: 'component',
        dependencies: expect.any(Array),
      });
    });
  });
});
