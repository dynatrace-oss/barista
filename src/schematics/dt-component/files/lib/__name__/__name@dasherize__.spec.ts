
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {Dt<%= classify(name) %>Module, Dt<%= classify(name) %>} from '@dynatrace/angular-components';

describe('Dt<%= classify(name) %>', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [Dt<%= classify(name) %>Module],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  /**
   * insert your tests here
   */
});

  /** Test component that contains an Dt<%= classify(name) %>. */
@Component({
  selector: 'dt-test-app',
  template: `
    <!-- insert your component testapp usage here -->
  `,
})
class TestApp {

}
