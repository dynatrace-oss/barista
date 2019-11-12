import { Component, OnInit } from '@angular/core';

import { DtTag } from '@dynatrace/angular-components/tag';

@Component({
  selector: 'tag-dev-app-demo',
  templateUrl: './tag-demo.component.html',
  styleUrls: ['./tag-demo.component.scss'],
})
export class TagDemo implements OnInit {
  tags = new Set<string>();

  value1 = 'My value 1';
  value2 = 'My value 2';
  value3 = 'My value 3';
  isDisabled = false;
  canRemove = false;
  hasKey = false;

  ngOnInit(): void {
    this.tags
      .add('Jelly')
      .add('Fish')
      .add('Pear')
      .add('Oreo')
      .add('KitKat')
      .add('Beer')
      .add('Raphaelo')
      .add('Bean')
      .add('Pine');
  }

  addTag(tag: string): void {
    this.tags.add(tag);
  }

  doRemove(tag: DtTag<string>): void {
    window.alert(`Tag removed: ${tag.value}`);
  }
}
