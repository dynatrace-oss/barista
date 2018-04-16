import { Component, ViewChild, ElementRef } from '@angular/core';
import { DtInlineEditor } from '@dynatrace/angular-components';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';

@Component({
  moduleId: module.id,
  selector: 'docs-inline-editor',
  styleUrls: ['./docs-inline-editor.component.scss'],
  templateUrl: './docs-inline-editor.component.html',
})
<<<<<<< HEAD
export class DocsInlineEditorComponent implements OnInit {
  contentString = 'hello world';
  @ViewChild('sectionTitle') sectionTitleReference: DtInlineEditor;

  ngOnInit() {};

  openEditor () {
    this.sectionTitleReference.enterEditing();
  }

  saveAndCloseEditor () {
    this.sectionTitleReference.saveAndQuitEditing();
=======
export class DocsInlineEditorComponent {
  sampleModel1: string = 'Sample #1';
  sampleModel2: string = 'Sample #2';
  sampleModel3Successful: string = 'Sample #3: Successful';
  sampleModel3Failing: string = 'Sample #3: Failing';
  @ViewChild('sampleEditor2') sampleEditor2: DtInlineEditor;

  successfulSave () {
    return new Observable<void>((observer) => {
      observer.next();
      observer.complete();
    }).delay(2e3);
>>>>>>> InlinEditor: Demo page
  }

  failingSave () {
    return new Observable<void>((observer) => {
      observer.error();
    }).delay(2e3);
  }
<<<<<<< HEAD

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
=======
}
>>>>>>> InlinEditor: Demo page
