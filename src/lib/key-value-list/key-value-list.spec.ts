import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {DtKeyValueListModule} from '@dynatrace/angular-components';

describe('DtKeyValueList', () => {

  const getKeyElement = (element: HTMLElement) => element.querySelector('.dt-key-value-list-item-key span');
  const getValueElement = (element: HTMLElement) => element.querySelector('.dt-key-value-list-item-value span');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtKeyValueListModule],
      declarations: [TestApp, TestApp2, TestApp3, TestAppContent],
    });

    TestBed.compileComponents();
  }));

  describe('key-value-list', () => {
    it('one column should be used', () => {
      const fixture = TestBed.createComponent(TestApp);
      const tileNativeElement = fixture.debugElement.nativeElement.querySelector('dt-key-value-list');
      expect(tileNativeElement).toBeDefined('Element not found');
      fixture.detectChanges(); // trigger initial data binding
      expect(tileNativeElement.getAttribute('dt-column') === '1')
      .toBeTruthy('Key Value list must contain 1 column');
    });

    it('two columns should be used', () => {
        const fixture = TestBed.createComponent(TestApp2);
        const tileNativeElement = fixture.debugElement.nativeElement.querySelector('dt-key-value-list');
        expect(tileNativeElement).toBeDefined('Element not found');
        fixture.detectChanges(); // trigger initial data binding
        expect(tileNativeElement.getAttribute('dt-column') === '2')
          .toBeTruthy('Key Value list must contain 2 columns');
      });
    it('three columns should be used', () => {
        const fixture = TestBed.createComponent(TestApp3);
        const tileNativeElement = fixture.debugElement.nativeElement.querySelector('dt-key-value-list');
        expect(tileNativeElement).toBeDefined('Element not found');
        fixture.detectChanges(); // trigger initial data binding
        expect(tileNativeElement.getAttribute('dt-column') === '3')
          .toBeTruthy('Key Value list must contain 3 columns');
      });
  });

  describe('attributes key value', () => {
    let fixture: ComponentFixture<TestApp>;
    let items: HTMLElement[];

    beforeEach(() => {
      fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();
      items = fixture.debugElement.nativeElement.querySelectorAll('dt-key-value-list-item');
    });

    it('should display 1st item data properly', () => {
      expect(getKeyElement(items[0])!.textContent).toBe('Temp');
      expect(getValueElement(items[0])!.textContent).toBe('1');
    });

    it('should display 2nd item data properly', () => {
      expect(getKeyElement(items[1])!.textContent).toBe('Temp1');
      expect(getValueElement(items[1])!.textContent).toBe('13');
    });

    it('should display 3rd item data properly', () => {
      expect(getKeyElement(items[2])!.textContent).toBe('Temp2');
      expect(getValueElement(items[2])!.textContent).toBe('28');
    });
  });

  describe('content key value', () => {
    let fixture: ComponentFixture<TestAppContent>;
    let items: HTMLElement[];

    beforeEach(() => {
      fixture = TestBed.createComponent(TestAppContent);
      fixture.detectChanges();
      items = fixture.debugElement.nativeElement.querySelectorAll('.dt-key-value-list-item');
    });

    it('should display 1st item data properly', () => {
      expect(getKeyElement(items[0])!.textContent).toBe('1st item content key');
      expect(getValueElement(items[0])!.textContent).toBe('1st item content value');
    });

    it('should display 2nd item data properly', () => {
      expect(getKeyElement(items[1])!.textContent).toBe('2nd item content key');
      expect(getValueElement(items[1])!.textContent).toBe('2nd item content value');
    });

    it('should not display content key when attribute key is provided', () => {
      expect(getKeyElement(items[2])!.textContent).toBe('3rd item attribute key');
      expect(getValueElement(items[2])!.textContent).toBe('3rd item content value');
    });

    it('should not display content value when attribute value is provided', () => {
      expect(getKeyElement(items[3])!.textContent).toBe('4th item content key');
      expect(getValueElement(items[3])!.textContent).toBe('4th item attribute value');
    });

    it('should support [dt-key-value-list-key],[dt-key-value-list-value] and display 5nd item data properly', () => {
      expect(getKeyElement(items[4])!.textContent).toBe('5th item content key');
      expect(getValueElement(items[4])!.textContent).toBe('5th item content value');
    });

    it('should support [dtKeyValueListKey] [dtKeyValueListValue] and display 6nd item data properly', () => {
      expect(getKeyElement(items[5])!.textContent).toBe('6th item content key');
      expect(getValueElement(items[5])!.textContent).toBe('6th item content value');
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
</dt-key-value-list>`,
})
class TestApp {

}

@Component({
    selector: 'dt-disabled-test-app',
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

@Component({
    selector: 'dt-test-app3',
    template: `<dt-key-value-list>
     <dt-key-value-list-item key="Temp" value="1"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp1" value="13"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp2" value="24"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp3" value="28"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp4" value="25"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp5" value="28"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp6" value="20"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp7" value="24"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp8" value="22"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp9" value="28"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp10" value="27"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp11" value="28"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp12" value="26"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp13" value="28"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp14" value="28"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp15" value="21"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp16" value="23"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp17" value="28"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp18" value="27"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp19" value="28"></dt-key-value-list-item>
     <dt-key-value-list-item key="Temp20" value="29"></dt-key-value-list-item>
  </dt-key-value-list>
    `,
  })
class TestApp3 {
}

@Component({
    selector: 'dt-test-content',
    template: `<dt-key-value-list>
     <dt-key-value-list-item>
       <dt-key-value-list-key>1st item content key</dt-key-value-list-key>
       <dt-key-value-list-value>1st item content value</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
       <dt-key-value-list-key>2nd item content key</dt-key-value-list-key>
       <dt-key-value-list-value>2nd item content value</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item key="3rd item attribute key">
       <dt-key-value-list-key>3rd item content key</dt-key-value-list-key>
       <dt-key-value-list-value>3rd item content value</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item value="4th item attribute value">
       <dt-key-value-list-key>4th item content key</dt-key-value-list-key>
       <dt-key-value-list-value>4th item content value</dt-key-value-list-value>
     </dt-key-value-list-item>
      <dt-key-value-list-item>
        <a dt-key-value-list-key>5th item content key</a>
        <span dt-key-value-list-value>5th item content value</span>
      </dt-key-value-list-item>
      <dt-key-value-list-item>
        <a dtKeyValueListKey>6th item content key</a>
        <span dtKeyValueListValue>6th item content value</span>
      </dt-key-value-list-item>
  </dt-key-value-list>
    `,
  })
class TestAppContent {
}
