
import {async, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {DtKeyValueListModule} from '@dynatrace/angular-components';

describe('DtKeyValueList', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtKeyValueListModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));
});

  /** Test component that contains an DtKeyValueList. */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-key-value-list>
   <dt-key-value-list-item key="Temp" value="1"></dt-key-value-list-item>
   <dt-key-value-list-item key="Temp1" value="13"></dt-key-value-list-item>
   <dt-key-value-list-item key="Temp2" value="28"></dt-key-value-list-item>
</dt-key-value-list>
  `,
})
class TestApp {

}
