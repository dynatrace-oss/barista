import { AttrAst, ElementAst } from "@angular/compiler";

export function isIconButtonAttr(attr: AttrAst): boolean {
  return attr.name === 'dt-icon-button';
}

export function isButtonAttr(attr: AttrAst): boolean {
  return attr.name === 'dt-button';
}

export function isButtonElement(element: ElementAst): boolean {
  const elementName = element.name;
  if (elementName !== 'button' && elementName !== 'a') {
    return false;
  }

  if (elementName === 'a' &&
    !element.attrs.some((attr) => (isButtonAttr(attr) || isIconButtonAttr(attr)))) {
    return false;
  }

  return true;
}
