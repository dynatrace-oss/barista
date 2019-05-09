import { AttrAst, ElementAst } from '@angular/compiler';

export function getAttribute(element: ElementAst, attribute: string): AttrAst | undefined {
  return element.attrs.find((attr) => attr.name === attribute);
}
