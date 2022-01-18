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

import {
  ComponentFactory,
  ViewContainerRef,
  ComponentRef,
  EmbeddedViewRef,
  Injector,
} from '@angular/core';

/**
 * Creates a new component instance at the position of a placeholder element.
 * Per default the placeholder element is then removed.
 */
export function createComponent<T>(
  factory: ComponentFactory<any>,
  viewContainerRef: ViewContainerRef,
  injector: Injector,
  placeholderElement: Element,
  projectableNodes: any[][] = [],
  shouldRemovePlaceholder: boolean = true,
): ComponentRef<T> {
  const componentRef: ComponentRef<T> = viewContainerRef.createComponent(
    factory,
    viewContainerRef.length,
    injector,
    [projectableNodes],
  );

  // At this point the component has been instantiated,
  // so we move it to the location in the DOM of the placeholder element.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const inserted = placeholderElement.parentElement!.insertBefore(
    getComponentRootNode(componentRef),
    placeholderElement,
  );
  // Get all attributes from placeholder element
  const attributes = Array.from(placeholderElement.attributes);

  // Try applying inputs.
  // Note: This can only be done with static attributes, not bindings!
  for (const input of factory.inputs) {
    if (placeholderElement.hasAttribute(input.templateName)) {
      const value = placeholderElement.getAttribute(input.templateName);
      // apply the matched attributes to the inputs of the created components
      componentRef.instance[input.propName] = value || input.templateName;
      // remove matches from attributes array so we can apply the remaining attributes at the end
      // otherwise the attributes that are already handled as inputs by angular
      // might cause problems
      attributes.splice(
        attributes.findIndex((attr) => attr.value === value),
        1,
      );
    }
  }

  // Set remaining attributes on inserted component
  for (const attr of attributes) {
    inserted.setAttribute(attr.name, attr.value);
  }

  // Now we can safely remove to placeholder element.
  if (shouldRemovePlaceholder) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    placeholderElement.parentElement!.removeChild(placeholderElement);
  }

  return componentRef;
}

/** Gets the root HTMLElement for an instantiated component. */
function getComponentRootNode(
  componentRef: ComponentRef<unknown>,
): HTMLElement {
  return (componentRef.hostView as EmbeddedViewRef<unknown>)
    .rootNodes[0] as HTMLElement;
}
