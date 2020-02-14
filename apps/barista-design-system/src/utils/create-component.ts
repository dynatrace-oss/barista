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
export function createComponent(
  // tslint:disable-next-line:no-any
  factory: ComponentFactory<any>,
  viewContainerRef: ViewContainerRef,
  injector: Injector,
  placeholderElement: Element,
  shouldRemovePlaceholder: boolean = true,
): ComponentRef<unknown> {
  const componentRef = viewContainerRef.createComponent(
    factory,
    viewContainerRef.length,
    injector,
  );

  // At this point the component has been instantiated,
  // so we move it to the location in the DOM of the placeholder element.
  placeholderElement.parentElement!.insertBefore(
    getComponentRootNode(componentRef),
    placeholderElement,
  );

  // Try applying inputs.
  // Note: This can only be done with static attributes, not bindings!
  for (const input of factory.inputs) {
    if (placeholderElement.hasAttribute(input.templateName)) {
      const value = placeholderElement.getAttribute(input.templateName);
      componentRef.instance[input.propName] = value || input.templateName;
    }
  }

  // Now we can safely remove to placeholder element.
  if (shouldRemovePlaceholder) {
    placeholderElement.parentElement!.removeChild(placeholderElement);
  }

  return componentRef;
}

/** Gets the root HTMLElement for an instantiated component. */
function getComponentRootNode(
  componentRef: ComponentRef<unknown>,
): HTMLElement {
  // tslint:disable-next-line: no-any
  return (componentRef.hostView as EmbeddedViewRef<unknown>)
    .rootNodes[0] as HTMLElement;
}
