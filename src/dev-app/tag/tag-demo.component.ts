import { Component } from '@angular/core';
import { DtTag } from '@dynatrace/angular-components/tag';

@Component({
  selector: 'tag-demo',
  templateUrl: './tag-demo.component.html',
  styleUrls: ['./tag-demo.component.scss'],
})
export class TagDemo {
  value1 = 'My value 1';
  value2 = 'My value 2';
  value3 = 'My value 3';
  isDisabled = false;
  canRemove = false;
  hasKey = false;

  doRemove(tag: DtTag<string>): void {
    window.alert(`Tag removed: ${tag.value}`);
  }
}
