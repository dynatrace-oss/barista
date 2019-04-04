import { TextAst } from '@angular/compiler';

export function hasTextContent(element: TextAst) {
  const nonWhitespaceCharacters = element.value.match(/\S/g);
  if (nonWhitespaceCharacters !== null && nonWhitespaceCharacters.length > 1) {
    return true;
  }
  return false;
}
