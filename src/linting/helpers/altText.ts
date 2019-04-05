import { AttrAst, BoundElementPropertyAst, ElementAst } from '@angular/compiler';

/**
 * Checks for aria-label attribute.
 * @param attrs element attributes
 * @param inputs element inputs / attribute bindings
 * @returns true if aria-label attribute or binding is set, false otherwise.
 */
function hasAriaLabel(attrs: AttrAst[], inputs: BoundElementPropertyAst[]): boolean {
  const hasAriaLabelAttr = attrs.some((attr) => attr.name === 'aria-label' && attr.value.trim().length > 0);
  const hasAriaLabelInput = inputs.some((input) => input.name === 'aria-label');

  return hasAriaLabelAttr || hasAriaLabelInput;
}

/**
 * Checks for aria-labelledby attribute.
 * @param attrs element attributes.
 * @param inputs element inputs / attribute bindings.
 * @returns true if aria-labelledby attribute or binding is set, false otherwise.
 */
function hasAriaLabelledby(attrs: AttrAst[], inputs: BoundElementPropertyAst[]): boolean {
  const hasAriaLabelledbyAttr = attrs.some((attr) => attr.name === 'aria-labelledby' && attr.value.trim().length > 0);
  const hasAriaLabelledbyInput = inputs.some((input) => input.name === 'aria-labelledby');
  // TODO: check reference if aria-labelledby given

  return hasAriaLabelledbyAttr || hasAriaLabelledbyInput;
}

/**
 * Checks if the given element provides text alternatives in form of an aria-label
 * or aria-labelledby attribute.
 * @param element the element to check.
 * @returns whether a text alternative is given.
 */
export function hasTextContentAlternative(element: ElementAst): boolean {
  const attrs: AttrAst[] = element.attrs;
  const inputs: BoundElementPropertyAst[] = element.inputs;
  if (hasAriaLabel(attrs, inputs) || hasAriaLabelledby(attrs, inputs)) {
    return true;
  }
  return false;
}
