import { AttrAst, BoundElementPropertyAst } from '@angular/compiler';

/**
 * Checks for aria-label attribute.
 * @param attrs element attributes
 * @param inputs element inputs / attribute bindings
 * @returns true if aria-label attribute or binding is set, false otherwise.
 */
export function hasAriaLabel(attrs: AttrAst[], inputs: BoundElementPropertyAst[]): boolean {
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
export function hasAriaLabelledby(attrs: AttrAst[], inputs: BoundElementPropertyAst[]): boolean {
  const hasAriaLabelledbyAttr = attrs.some((attr) => attr.name === 'aria-labelledby' && attr.value.trim().length > 0);
  const hasAriaLabelledbyInput = inputs.some((input) => input.name === 'aria-labelledby');
  // TODO: check reference if aria-labelledby given

  return hasAriaLabelledbyAttr || hasAriaLabelledbyInput;
}
