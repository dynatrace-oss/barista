import { Component } from '@angular/core';
import { DefaultInlineEditorExample } from './examples/inline-editor-default-example';
import { ApiInlineEditorExample } from './examples/inline-editor-api-example';
import { SuccessfulInlineEditorExample } from './examples/inline-editor-successful-example';
import { FailingInlineEditorExample } from './examples/inline-editor-failing-example';

@Component({
  moduleId: module.id,
  selector: 'docs-inline-editor',
  styleUrls: ['./docs-inline-editor.component.scss'],
  templateUrl: './docs-inline-editor.component.html',
})
export class DocsInlineEditorComponent {
  examples = {
    default: DefaultInlineEditorExample,
    api: ApiInlineEditorExample,
    successful: SuccessfulInlineEditorExample,
    failing: FailingInlineEditorExample,
  };
}
