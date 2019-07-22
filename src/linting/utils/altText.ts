import {
  AttrAst,
  BoundElementPropertyAst,
  ElementAst,
} from '@angular/compiler';

/**
 * Checks for attribute or bindings with given name.
 * @param attrs element attributes.
 * @param inputs element inputs / attribute bindings.
 * @returns true if aria-labelledby attribute or binding is set, false otherwise.
 */
function hasAttributeValue(
  name: string,
  attrs: AttrAst[],
  inputs: BoundElementPropertyAst[],
): boolean {
  const hasAttr = attrs.some(
    attr => attr.name === name && attr.value.trim().length > 0,
  );
  const hasInput = inputs.some(input => input.name === name);
  // TODO: check reference if aria-labelledby given?

  return hasAttr || hasInput;
}

/**
 * Checks if the given element provides text alternatives in form of an aria-label
 * or aria-labelledby attribute.
 * @param element the element to check.
 * @param attribute the attribute to look for (optional); aria-label and aria-labelledby when not given
 * @returns whether a text alternative is given.
 */
export function hasTextContentAlternative(
  element: ElementAst,
  attribute?: string,
): boolean {
  const attrs: AttrAst[] = element.attrs;
  const inputs: BoundElementPropertyAst[] = element.inputs;

  if (attribute === undefined) {
    return (
      hasAttributeValue('aria-label', attrs, inputs) ||
      hasAttributeValue('aria-labelledby', attrs, inputs)
    );
  }

  return hasAttributeValue(attribute, attrs, inputs);
}
