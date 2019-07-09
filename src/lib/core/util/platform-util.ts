import { Renderer2 } from '@angular/core';

/**
 * Replaces an old class on an element with a new on.
 * Both can also be null. In this case it just adds the new one or removes the old one.
 * If the optional Renderer is not provided it uses the browser specific classList.
 */
// tslint:disable-next-line:no-any
export function replaceCssClass(
  elOrRef: any,
  oldClass: string | null,
  newClass: string | null,
  renderer?: Renderer2
): void {
  const el = elOrRef.nativeElement || elOrRef;
  if (oldClass) {
    removeCssClass(el, oldClass, renderer);
  }
  if (newClass) {
    addCssClass(el, newClass, renderer);
  }
}

// tslint:disable-next-line:no-any
export function addCssClass(el: any, name: string, renderer?: Renderer2): void {
  if (renderer) {
    renderer.addClass(el, name);
  } else {
    el.classList.add(name);
  }
}

// tslint:disable-next-line:no-any
export function removeCssClass(
  el: any,
  name: string,
  renderer?: Renderer2
): void {
  if (renderer) {
    renderer.removeClass(el, name);
  } else {
    el.classList.remove(name);
  }
}

/**
 * Helper function to safely check if an element has a class
 * Also works with elements in svgs
 */
// tslint:disable-next-line:no-any
export function hasCssClass(el: any, name: string): boolean {
  // classList cant be used safely for elements in svgs - thats why we are using getAttribute
  const classes = el.getAttribute('class') || '';
  return classes.split(' ').includes(name);
}

/**
 * Reads the key code from a keyboard event.
 * It is needed because event.keyCode is deprecated an will lead to multiple tslint errors.
 * This function will move the the event.keyKode to a single point where we disable the tslint rule.
 */
export function readKeyCode(event: KeyboardEvent): number {
  // tslint:disable-next-line:deprecation
  return event.keyCode;
}
