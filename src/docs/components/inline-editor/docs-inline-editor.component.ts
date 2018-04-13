import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DtInlineEditor } from '@dynatrace/angular-components';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';

@Component({
  moduleId: module.id,
  selector: 'docs-inline-editor',
  styleUrls: ['./docs-inline-editor.component.scss'],
  templateUrl: './docs-inline-editor.component.html',
})
export class DocsInlineEditorComponent implements OnInit {
  contentString = 'hello world';
  @ViewChild('sectionTitle') sectionTitleReference: DtInlineEditor;

  ngOnInit() {};

  openEditor () {
    this.sectionTitleReference.enterEditing();
  }

  saveAndCloseEditor () {
    this.sectionTitleReference.saveAndQuitEditing();
  }

  cancelAndCloseEditor () {
    this.sectionTitleReference.cancelAndQuitEditing();
  }

  saveMessage = () => new Observable<void>((observer) => {
    observer.next()
    // observer.error()
    observer.complete()
  }).delay(5000);

  // saveMessage = (message) => {
  //   return new Promise(function(resolve, reject) {
  //     console.log('async method called with text ' + message);
  //     setTimeout(() => {
  //       if (message) {
  //         resolve('Stuff worked!');
  //       } else {
  //         reject(Error('It broke'));
  //       }
  //     }, 5000);
  //   });
  // }
}