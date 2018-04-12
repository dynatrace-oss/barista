import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DtInlineEditor } from '../../../lib/inline-editor/inline-editor.component';

@Component({
  moduleId: module.id,
  selector: 'docs-inline-editor',
  styleUrls: ['./docs-inline-editor.component.scss'],
  templateUrl: './docs-inline-editor.component.html',
})
export class DocsInlineEditorComponent implements OnInit {
  contentString: string = "hello world"
  @ViewChild('sectionTitle') sectionTitleReference: DtInlineEditor;

  ngOnInit() {
    // this.sectionTitleReference.enterEditingMode();
  }

  openEditor () {
    this.sectionTitleReference.enterEditing();
  }

  closeEditor () {
    this.sectionTitleReference.cancelAndQuitEditing();
  }
}
