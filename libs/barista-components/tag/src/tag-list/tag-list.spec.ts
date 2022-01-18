/**
 * @license
 * Copyright 2021 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  Component,
  DebugElement,
  ElementRef,
  NgZone,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtTagModule } from '../tag-module';
import {
  DtTagList,
  getIndexForFirstHiddenTag,
  getWrapperWidth,
} from './tag-list';
import { DtTagAddSubmittedDefaultEvent } from '../tag-add/tag-add';
import { createComponent, MockNgZone } from '@dynatrace/testing/browser';
import { DtTag } from '../tag';

describe('DtTagList', () => {
  let fixture: ComponentFixture<DtTagListComponent>;
  let instanceDebugElement: DebugElement;
  let tagListNativeElement: HTMLElement;
  let zone: MockNgZone;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
          DtTagModule,
        ],
        declarations: [DtTagListComponent],
        providers: [
          { provide: NgZone, useFactory: () => (zone = new MockNgZone()) },
        ],
      });
      TestBed.compileComponents();
      fixture = createComponent(DtTagListComponent);
      instanceDebugElement = fixture.debugElement.query(
        By.directive(DtTagList),
      );
      tagListNativeElement = instanceDebugElement.nativeElement;
    }),
  );

  describe('basic behavior', () => {
    it('should add the `dt-tag-list` class', () => {
      expect(tagListNativeElement.classList).toContain('dt-tag-list');
    });
  });

  describe('DtTagList ViewPort tests', () => {
    beforeEach(() => {
      fixture = createComponent(DtTagListComponent);
      mockBoundingClientRectOnTagList();
      zone.simulateZoneExit();
      fixture.detectChanges();
      instanceDebugElement = fixture.debugElement.query(
        By.directive(DtTagList),
      );
      tagListNativeElement = instanceDebugElement.nativeElement;
    });

    it('should not show a more button when all tags fit into the viewport', () => {
      const moreBtn = fixture.debugElement.query(
        By.css('.dt-tag-list-more-btn'),
      );
      expect(moreBtn).not.toBe('0 More...');
      expect(moreBtn).toBeNull();
    });

    it('should show 1 more button when a tag does not fit into viewport', () => {
      fixture.componentInstance.tags.add('Test');
      fixture.detectChanges();
      mockBoundingClientRectOnTagList();
      zone.simulateZoneExit();
      fixture.detectChanges();
      const moreBtn = fixture.debugElement.query(
        By.css('.dt-tag-list-more-btn'),
      );
      expect(moreBtn.nativeElement.textContent).toBe('1 More...');
    });

    it('should show an "add tag" button at the end if provided', () => {
      const addTagBtn = fixture.debugElement.query(
        By.css('.dt-tag-add-button'),
      );
      expect(addTagBtn).not.toBeNull();
    });

    it('should show an "add tag" button at the correct position if tags are added dynamically', () => {
      let tagElements: HTMLCollection =
        fixture.debugElement.nativeElement.querySelectorAll(
          '.dt-tag, .dt-tag-add',
        );
      expect(tagElements.item(3)!.innerHTML).toContain('Add Tag');
      fixture.componentInstance.tags.add('Health');
      fixture.componentInstance.tags.add('Juice');
      fixture.componentInstance.tags.add('Tick');
      fixture.detectChanges();
      tagElements = fixture.debugElement.nativeElement.querySelectorAll(
        '.dt-tag, .dt-tag-add',
      );
      expect(tagElements.item(6)!.innerHTML).toContain('Add Tag');
    });
  });

  describe('tag list functions test', () => {
    describe('getIndexForFirstHiddenTag', () => {
      it('should return 0 when all tags fit in one line', () => {
        const elements = mockHTMLElements(3);
        expect(getIndexForFirstHiddenTag(elements)).toBe(0);
      });

      it('should return 3 when 4th tag doesnt fit in one line', () => {
        const elements = mockHTMLElements(4);
        expect(getIndexForFirstHiddenTag(elements)).toBe(3);
      });
    });

    describe('getWrapperWidth', () => {
      it('should return width 124', () => {
        const elements = mockHTMLElements(4);
        expect(
          getWrapperWidth(
            elements[getIndexForFirstHiddenTag(elements) - 1],
            100,
          ),
        ).toBe(124);
      });
    });
  });

  // Mocks HTMLElements with getBoundingClientRect
  function mockHTMLElements(tagCount: number): HTMLElement[] {
    const elements: HTMLElement[] = [];
    for (let i = 0; i < tagCount; i++) {
      const mockedTop = i < 3 ? 0 : 40;
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const mockedElement = {
        getBoundingClientRect: () => ({
          top: mockedTop,
          left: i * 100,
          width: 20,
        }),
      } as HTMLElement;
      elements.push(mockedElement);
    }
    return elements;
  }

  // Mocks BoundClientRect for tagElementRefs
  function mockBoundingClientRectOnTagList(): void {
    fixture.componentInstance._tagElementRefs
      .map((refs) => refs.nativeElement)
      .forEach((nativeElement, index) => {
        const mockedTop = index < 3 ? 0 : 40;
        jest.spyOn(nativeElement, 'getBoundingClientRect').mockReturnValue({
          bottom: 1,
          height: 1,
          left: index * 100,
          right: 100,
          top: mockedTop,
          width: 100,
        });
      });
  }
});

/** Test component that contains a DtTagList. */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-tag-list>
      <dt-tag *ngFor="let tag of tags">{{ tag }}</dt-tag>
      <dt-tag-add (submitted)="addTag($event)"></dt-tag-add>
    </dt-tag-list>
  `,
})
class DtTagListComponent implements OnInit {
  @ViewChildren(DtTag, { read: ElementRef })
  _tagElementRefs: QueryList<ElementRef>;

  tags = new Set<string>();

  ngOnInit(): void {
    this.tags.add('Window').add('Managed').add('Errors');
  }

  addTag(event: DtTagAddSubmittedDefaultEvent): void {
    this.tags.add(event.tag);
  }
}
