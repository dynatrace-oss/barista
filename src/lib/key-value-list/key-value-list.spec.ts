
import {async, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {DtKeyValueListModule} from '@dynatrace/angular-components';

describe('DtKeyValueList', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtKeyValueListModule],
      declarations: [TestApp, TestApp2],
    });

    TestBed.compileComponents();
  }));

  describe('key-value-list', () => {
    it('one column should be used', () => {
      const fixture = TestBed.createComponent(TestApp);
      const tileNativeElement = fixture.debugElement.nativeElement.querySelector('dt-key-value-list');
      expect(tileNativeElement).toBeDefined('Element not found');
      fixture.detectChanges(); // trigger initial data binding
      expect(tileNativeElement.classList.length).toBeGreaterThanOrEqual(1, 'At least one class must be defined');
      expect(tileNativeElement.classList.contains('dtKeyValueListColumns1'))
        .toBeTruthy('Key Value list should contain 1 column only');
    });

    it('two column should be used', () => {
        const fixture = TestBed.createComponent(TestApp2);
        const tileNativeElement = fixture.debugElement.nativeElement.querySelector('dt-key-value-list');
        expect(tileNativeElement).toBeDefined('Element not found');
        fixture.detectChanges(); // trigger initial data binding
        expect(tileNativeElement.classList.length).toBeGreaterThanOrEqual(1, 'At least one class must be defined');
        expect(tileNativeElement.classList.contains('dtKeyValueListColumns2'))
          .toBeTruthy('Key Value list should contain 2 column only');
      });
  });
});

  /** Test component that contains an DtKeyValueList. */
@Component({
  selector: 'dt-test-app',
  template: `<dt-key-value-list>
   <dt-key-value-list-item key="Temp" value="1"></dt-key-value-list-item>
   <dt-key-value-list-item key="Temp1" value="13"></dt-key-value-list-item>
   <dt-key-value-list-item key="Temp2" value="28"></dt-key-value-list-item>
</dt-key-value-list>
  `,
})
class TestApp {

}

@Component({
    selector: 'dt-test-app2',
    template: `<dt-key-value-list>
     <dt-key-value-list-item key="Temp" value="1"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp1" value="13"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp2" value="28"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp3" value="28"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp4" value="28"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp5" value="28"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp6" value="28"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp7" value="28"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp8" value="28"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp9" value="28"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp10" value="28"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp11" value="28"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp12" value="28"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp13" value="28"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp14" value="28"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp15" value="28"></dt-key-value-list-item>
  </dt-key-value-list>
    `,
  })
class TestApp2 {

}
