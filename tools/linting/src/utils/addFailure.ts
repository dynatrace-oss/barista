import { ElementAst, EmbeddedTemplateAst } from '@angular/compiler';
import { BasicTemplateAstVisitor } from 'codelyzer';

export function addFailure(
  visitor: BasicTemplateAstVisitor,
  element: ElementAst | EmbeddedTemplateAst,
  message: string,
): void {
  const startOffset = element.sourceSpan.start.offset;
  const endOffset = element.sourceSpan.end.offset;
  visitor.addFailureFromStartToEnd(startOffset, endOffset, message);
}
