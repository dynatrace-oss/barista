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

/**
 * Adds relaunch buttons for toggling the theme of the given node.
 * @param node The node to add relaunch data to
 */
export function addThemeRelaunchDataToNode(node: BaseNode): void {
  if (node.type === 'INSTANCE' || node.type === 'COMPONENT') {
    // Changing relaunch data on an instance throws an error.
    return;
  }

  node.setRelaunchData({
    'set-theme:surface': '',
    'set-theme:abyss': '',
  });
}

/**
 * Creates default relaunch data. This adds theme switching buttons
 * to all container elements on that are direct children of page nodes.
 * @see isContainerNode
 */
export function createDefaultRelaunchData(): void {
  for (const page of figma.root.children) {
    for (const container of page.findChildren(isContainerNode)) {
      if (!container.getPluginData('fluid-theme')) {
        addThemeRelaunchDataToNode(container);
      }
    }
  }
}

/** Whether the given node is a container that can be theme-switched */
export function isContainerNode(node: BaseNode): boolean {
  return ['FRAME', 'COMPONENT', 'INSTANCE'].includes(node.type);
}

/** Whether the given node is geometry that has a fill and stroke color */
export function isGeometryNode(node: BaseNode): boolean {
  return [
    'RECTANGLE',
    'LINE',
    'ELLIPSE',
    'POLYGON',
    'STAR',
    'VECTOR',
    'TEXT',
    'FRAME',
    'COMPONENT',
    'INSTANCE',
  ].includes(node.type);
}
