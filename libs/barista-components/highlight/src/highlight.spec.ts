/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import { Component } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DtHighlightModule } from './highlight-module';

import { createComponent } from '@dynatrace/testing/browser';

describe('DtHighlight', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [DtHighlightModule],
        declarations: [
          TestComponentWithoutTerm,
          TestComponentWithHtmlInText,
          TestComponentWithStaticQueryAndStaticText,
          TestComponentWithMultipleHighlights,
          TestComponentWithStaticCaseSensitive,
          TestComponentWithHighlightedHtml,
          TestComponentWithInputBinding,
          TestComponentWithTextBinding,
          TestCasingHighlighted,
          TestComponentWithHtmlChars,
        ],
      });

      TestBed.compileComponents();
    }),
  );
  describe('with initial behavior', () => {
    it('should show the original text if no term is given', () => {
      const fixture = createComponent(TestComponentWithoutTerm);
      const containerEl = fixture.debugElement.query(
        By.css('.dt-highlight'),
      ).nativeElement;

      fixture.detectChanges();
      const transformed = containerEl.lastChild as HTMLElement;
      expect(transformed.innerHTML).toMatch(
        'Original text where nothing should be highlighted',
      );
    });

    it('should contain one container for the original source and one for the escaped text', () => {
      const fixture = createComponent(TestComponentWithHtmlInText);
      const containerEl = fixture.debugElement.query(
        By.css('.dt-highlight'),
      ).nativeElement;

      expect(containerEl.childNodes.length).toBe(2);
      const hiddenSource = containerEl.firstChild as HTMLElement;
      const transformed = containerEl.lastChild as HTMLElement;
      expect(hiddenSource.tagName).toMatch('DIV');
      expect(hiddenSource.innerHTML).toMatch(
        'Some <b>text where</b> with html characters',
      );
      expect(transformed.tagName).toMatch('SPAN');
    });

    it('should escape every html character in the projected content', () => {
      const fixture = createComponent(TestComponentWithHtmlInText);
      const containerEl = fixture.debugElement.query(
        By.css('.dt-highlight'),
      ).nativeElement;

      const transformed = containerEl.lastChild as HTMLElement;
      expect(transformed.tagName).toMatch('SPAN');
      expect(transformed.innerHTML).toMatch('');

      fixture.detectChanges();
      expect(transformed.innerHTML).toMatch(
        'Some &lt;b&gt;text where&lt;/b&gt; with html characters',
      );
    });

    it('should wrap the highlighted word with a mark tag', () => {
      const fixture = createComponent(
        TestComponentWithStaticQueryAndStaticText,
      );
      const containerEl = fixture.debugElement.query(
        By.css('.dt-highlight'),
      ).nativeElement;

      const transformed = containerEl.lastChild as HTMLElement;
      expect(transformed.tagName).toMatch('SPAN');
      expect(transformed.innerHTML).toMatch('');

      fixture.detectChanges();
      const highlights = transformed.querySelectorAll('.dt-highlight-mark');
      expect(highlights.length).toBe(1);
      expect(highlights[0].tagName).toMatch('MARK');
      expect(highlights[0].innerHTML).toMatch('wher');
    });

    it('should find multiple occurrences of the term that should be highlighted', () => {
      const fixture = createComponent(TestComponentWithMultipleHighlights);
      const containerEl = fixture.debugElement.query(
        By.css('.dt-highlight'),
      ).nativeElement;

      const transformed = containerEl.lastChild as HTMLElement;
      expect(transformed.tagName).toMatch('SPAN');
      expect(transformed.innerHTML).toMatch('');

      fixture.detectChanges();
      const highlights = transformed.querySelectorAll('.dt-highlight-mark');
      expect(highlights.length).toBe(4);
      expect(highlights[0].tagName).toMatch('MARK');
      expect(highlights[0].innerHTML).toMatch('S');
      expect(highlights[1].innerHTML).toMatch('s');
      expect(highlights[2].innerHTML).toMatch('s');
      expect(highlights[3].innerHTML).toMatch('s');
    });

    it('should find multiple occurrences of the term that should be highlighted but case sensitive', () => {
      const fixture = createComponent(TestComponentWithStaticCaseSensitive);
      const containerEl = fixture.debugElement.query(
        By.css('.dt-highlight'),
      ).nativeElement;

      const transformed = containerEl.lastChild as HTMLElement;
      expect(transformed.tagName).toMatch('SPAN');
      expect(transformed.innerHTML).toMatch('');

      fixture.detectChanges();
      const highlights = transformed.querySelectorAll('.dt-highlight-mark');
      expect(highlights.length).toBe(3);
      expect(highlights[0].tagName).toMatch('MARK');
      expect(highlights[0].innerHTML).toMatch('s');
      expect(highlights[1].innerHTML).toMatch('s');
      expect(highlights[2].innerHTML).toMatch('s');
    });

    it('should highlight found content and escape every html character inside the projected content', () => {
      const fixture = createComponent(TestComponentWithHighlightedHtml);
      const containerEl = fixture.debugElement.query(
        By.css('.dt-highlight'),
      ).nativeElement;

      const transformed = containerEl.lastChild as HTMLElement;
      expect(transformed.tagName).toMatch('SPAN');
      expect(transformed.innerHTML).toMatch('');

      fixture.detectChanges();

      expect(
        transformed.innerHTML.startsWith('Some &lt;b&gt;text '),
      ).toBeTruthy();
      expect(
        transformed.innerHTML.endsWith(
          'e&lt;/b&gt; a part should be highlighted',
        ),
      ).toBeTruthy();

      const highlights = transformed.querySelectorAll('.dt-highlight-mark');
      expect(highlights.length).toBe(1);
      expect(highlights[0].tagName).toMatch('MARK');
      expect(highlights[0].innerHTML).toMatch('wher');
    });

    it('should render and highlight special HTML char', () => {
      const fixture = createComponent(TestComponentWithHtmlChars);
      const containerEl = fixture.debugElement.query(
        By.css('.dt-highlight'),
      ).nativeElement;

      fixture.detectChanges();

      const transformed = containerEl.lastChild as HTMLElement;
      expect(transformed.textContent).toMatch(`<>"&— '¢£¥€©®∀∅∃∇∈∉∋∏∑`);

      const highlights = transformed.querySelectorAll('.dt-highlight-mark');
      expect(highlights.length).toBe(1);
      expect(highlights[0].textContent).toMatch('>');
    });
  });

  describe('with dynamic bindings', () => {
    it('should update the highlight when term is changed', () => {
      const fixture = createComponent(TestComponentWithInputBinding);
      const instance = fixture.componentInstance;
      const containerEl = fixture.debugElement.query(
        By.css('.dt-highlight'),
      ).nativeElement;

      const transformed = containerEl.lastChild as HTMLElement;
      expect(transformed.tagName).toMatch('SPAN');
      expect(transformed.innerHTML).toMatch('');

      fixture.detectChanges();

      let highlights = transformed.querySelectorAll('.dt-highlight-mark');
      expect(highlights.length).toBe(0);

      instance.term = 'Some';
      fixture.detectChanges();

      highlights = transformed.querySelectorAll('.dt-highlight-mark');
      expect(highlights.length).toBe(1);
      expect(highlights[0].innerHTML).toMatch('Some');

      instance.term = 's';
      fixture.detectChanges();

      highlights = transformed.querySelectorAll('.dt-highlight-mark');
      expect(highlights.length).toBe(2);
      expect(highlights[0].innerHTML).toMatch('S'); // Some
      expect(highlights[1].innerHTML).toMatch('s'); // should
    });

    it('should update the highlight when caseSensitive is changed', () => {
      const fixture = createComponent(TestComponentWithInputBinding);
      const instance = fixture.componentInstance;
      const containerEl = fixture.debugElement.query(
        By.css('.dt-highlight'),
      ).nativeElement;

      const transformed = containerEl.lastChild as HTMLElement;
      expect(transformed.tagName).toMatch('SPAN');
      expect(transformed.innerHTML).toMatch('');

      instance.term = 'some';
      fixture.detectChanges();

      let highlights = transformed.querySelectorAll('.dt-highlight-mark');
      expect(highlights.length).toBe(1);
      expect(highlights[0].innerHTML).toMatch('Some');

      instance.caseSensitive = true;
      fixture.detectChanges();

      highlights = transformed.querySelectorAll('.dt-highlight-mark');
      expect(highlights.length).toBe(0);
    });

    it('should highlight when term contains quantifier characters', () => {
      const fixture = createComponent(TestComponentWithInputBinding);
      const instance = fixture.componentInstance;
      instance.term = 'highlighted?';
      fixture.detectChanges();

      const containerEl = fixture.debugElement.query(
        By.css('.dt-highlight'),
      ).nativeElement;

      const transformed = containerEl.lastChild as HTMLElement;
      const highlights = transformed.querySelectorAll('.dt-highlight-mark');
      expect(highlights.length).toBe(1);
      expect(highlights[0].innerHTML).toMatch('highlighted?');
    });

    it('should update the highlight when the dynamic text changes', () => {
      const fixture = createComponent(TestComponentWithTextBinding);
      const instance = fixture.componentInstance;
      const containerEl = fixture.debugElement.query(
        By.css('.dt-highlight'),
      ).nativeElement;

      expect(containerEl.childNodes.length).toBe(2);

      const transformed = containerEl.lastChild as HTMLElement;
      let highlights = transformed.querySelectorAll('.dt-highlight-mark');
      expect(highlights.length).toBe(0);

      instance.name = 'Jane';
      fixture.detectChanges();
      highlights = transformed.querySelectorAll('.dt-highlight-mark');
      expect(highlights.length).toBe(1);
      expect(highlights[0].innerHTML).toMatch('Jane');
    });

    it('should keep the text casing of the original text when it is not case sensitive', () => {
      const fixture = createComponent(TestCasingHighlighted);
      const containerEl: HTMLElement = fixture.debugElement.query(
        By.css('.dt-highlight span'),
      ).nativeElement;

      expect(containerEl.textContent).toBe('HTTP-Monitoring');
    });
  });

  describe('accessibility', () => {
    it('should hide the source container from screen readers', () => {
      const fixture = createComponent(TestComponentWithHtmlInText);
      const containerEl = fixture.debugElement.query(
        By.css('.dt-highlight'),
      ).nativeElement;

      expect(containerEl.childNodes.length).toBe(2);
      const hiddenSource = containerEl.firstChild as HTMLElement;
      expect(hiddenSource.tagName).toMatch('DIV');
      expect(hiddenSource.getAttribute('aria-hidden')).toMatch('true');
    });

    // eslint-disable-next-line
    it.skip('should add a notice for screen readers when an element is marked', () => {
      const fixture = createComponent(
        TestComponentWithStaticQueryAndStaticText,
      );
      const containerEl = fixture.debugElement.query(
        By.css('.dt-highlight'),
      ).nativeElement;

      expect(containerEl.childNodes.length).toBe(2);
      const transformed = containerEl.lastChild as HTMLElement;
      fixture.detectChanges();

      const highlight = transformed.querySelectorAll('.dt-highlight-mark')[0];

      // TODO: [e2e] getComputedStyle is not available in jsdom environment

      expect(getComputedStyle(highlight, ':before').content).toContain(
        '[highlight start]',
      );
      expect(getComputedStyle(highlight, ':after').content).toContain(
        '[highlight end]',
      );
    });
  });
});

@Component({
  template: `
    <p dt-highlight>Original text where nothing should be highlighted</p>
  `,
})
class TestComponentWithoutTerm {}

@Component({
  template: `
    <p dt-highlight term="">
      Some
      <b>text where</b>
      with html characters
    </p>
  `,
})
class TestComponentWithHtmlInText {}

@Component({
  template: `
    <p dt-highlight term="wher">Some text where a part should be highlighted</p>
  `,
})
class TestComponentWithStaticQueryAndStaticText {}

@Component({
  template: `
    <span dt-highlight term="s">
      Some text where some parts should be highlighted
    </span>
  `,
})
class TestComponentWithMultipleHighlights {}

@Component({
  template: `
    <span dt-highlight term="s" caseSensitive>
      Some text where some parts should be highlighted
    </span>
  `,
})
class TestComponentWithStaticCaseSensitive {}

@Component({
  template: `
    <p dt-highlight term="wher">
      Some
      <b>text where</b>
      a part should be highlighted
    </p>
  `,
})
class TestComponentWithHighlightedHtml {}

@Component({
  template: ` <dt-highlight [term]="value">HTTP-Monitoring</dt-highlight> `,
})
class TestCasingHighlighted {
  value = 'HTTP';
}

@Component({
  template: `
    <dt-highlight [term]="term" [caseSensitive]="caseSensitive">
      Some text where a part should be highlighted?
    </dt-highlight>
  `,
})
class TestComponentWithInputBinding {
  term = '';
  caseSensitive = false;
}

@Component({
  template: `
    <dt-highlight term="Jane">
      We welcome {{ name }} to this event.
    </dt-highlight>
  `,
})
class TestComponentWithTextBinding {
  name = 'John';
}

@Component({
  template: `
    <dt-highlight term=">">
      &lt;&gt;&quot;&amp;&mdash;&nbsp;&apos;&cent;&pound;&yen;&euro;&copy;&reg;&forall;&empty;&exist;&nabla;&isin;&notin;&ni;&prod;&sum;
    </dt-highlight>
  `,
})
class TestComponentWithHtmlChars {}
