import { ElementAst } from '@angular/compiler';

export interface ParentElement {
  name: string;
  startLine: number;
  children: ElementAst[];
}
