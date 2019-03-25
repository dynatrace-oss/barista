import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DtHighlightModule, DtHighlight } from '@dynatrace/angular-components';

describe('DtHighlight', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtHighlightModule],
      // tslint:disable-next-line: no-use-before-declare
      declarations: [TestComponent],
    });

    TestBed.compileComponents();
  }));


  /**
   * insert your tests here
   */
});

/** Test component that contains an DtHighlight. */
@Component({
  selector: 'dt-test-app',
  template: `
    <p dt-highlight="wher">Some text where a part should be highlighted</p>
    <span dt-highlight="wher">Some text where a part should be highlighted</span>
    <p dt-highlight="wher">Some <b>text where</b> a part should be highlighted</p>
    <p dt-highlight="wher"><div>Some text where a part should be highlighted</div></p>
    <p dt-highlight="wher">Some text where a part should <em>be</em> highlighted</p>
  `,
})
class TestComponent {}
