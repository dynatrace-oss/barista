import { ElementAst } from "@angular/compiler";

export function hasChildren(element: ElementAst) {
  return element.children && element.children.length > 0;
}
