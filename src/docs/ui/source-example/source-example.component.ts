import { ComponentPortal } from '@angular/cdk/portal';
import { Component, Input, Type } from '@angular/core';
import { TemplateRetriever } from '../../core/template-retriever';

@Component({
  moduleId: module.id,
  selector: 'docs-source-example',
  styleUrls: ['source-example.component.scss'],
  templateUrl: 'source-example.component.html',
})
export class SourceExampleComponent {

  source = '';
  codeVisible = false;
  portal: ComponentPortal<{}>;

  @Input()
  set componentType(component: Type<{}>) {
    // tslint:disable-next-line:no-inferred-empty-object-type
    this.portal = new ComponentPortal(component);
    const source = TemplateRetriever.fromComponent(component);
    this.source = transformSource(source);
  }
}

function transformSource(source: string): string {
  // Remove empty lines at the start of the source
  let transformed = source.replace(/^(\s*\r?\n)*/g, '');
  // Remove empty lines at the end of the source
  transformed = transformed.replace(/(\r?\n\s*)*$/g, '');

  const lines = transformed.split(/\r?\n/);
  if (lines.length) {
    // Calculate the prepending whitespace of the first line
    // so we know the indentation for the rest of the source.
    const initialWhitespaceResult = lines[0].match(/^[\s\t]*/);
    if (initialWhitespaceResult) {
      // Calculate the number of characters of the indentation
      const initialWhitespaceCount = initialWhitespaceResult[0].length;
      // Create a regex that for this indentation
      const initialWhitespaceRegex = new RegExp(`^[\\s\\t]{${initialWhitespaceCount}}`);
      // Remove indentation from ever line of the source
      transformed = lines.map((line) => line.replace(initialWhitespaceRegex, '')).join('\n');
    }
  }
  return transformed;
}
