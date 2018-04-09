import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'docs-inline-editor',
  styleUrls: ['./docs-inline-editor.component.scss'],
  templateUrl: './docs-inline-editor.component.html',
})
export class DocsInlineEditorComponent {
  contentString: string = "hello world"
}
