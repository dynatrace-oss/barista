import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'tag-list-barista-example',
  template: `
    <dt-tag-list>
      <dt-tag *ngFor="let tag of tags">{{ tag }}</dt-tag>
      <dt-tag-add
        placeholder="insert tag name here"
        aria-label="tag input"
        (tagAdded)="addTag($event)"
      ></dt-tag-add>
    </dt-tag-list>
  `,
})
export class TagListWithTagAddExample implements OnInit {
  tags = new Set<string>();

  ngOnInit(): void {
    this.tags.add('window');
    this.tags.add('deploy');
    this.tags.add('.NetTest');
    this.tags.add('193.168.4.3:80');
    this.tags.add('loadtest');
    this.tags.add('sdk-showroom');
    this.tags.add('requests');
    this.tags.add('cluster');
    this.tags.add('server');
    this.tags.add('node');
  }

  addTag(tag: string): void {
    this.tags.add(tag);
  }
}
