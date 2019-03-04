import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {DtKeyValueListModule} from '@dynatrace/angular-components';

describe('DtKeyValueList', () => {

  const getKeyElement = (element: HTMLElement) => element.querySelector('.dt-key-value-list-item-key span');
  const getValueElement = (element: HTMLElement) => element.querySelector('.dt-key-value-list-item-value span');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtKeyValueListModule],
      declarations: [TestAppSingleColumn, TestAppTwoColumns, TestAppThreeColumns],
    });

    TestBed.compileComponents();
  }));

  describe('key-value-list', () => {
    it('one column should be used', () => {
      const fixture = TestBed.createComponent(TestAppSingleColumn);
      const tileNativeElement = fixture.debugElement.nativeElement.querySelector('dt-key-value-list');
      fixture.detectChanges(); // trigger initial data binding
      expect(tileNativeElement).toBeDefined('Element not found');
      expect(tileNativeElement.getAttribute('dt-column') === '1')
      .toBeTruthy('Key Value list must contain 1 column');
    });

    it('two columns should be used', () => {
        const fixture = TestBed.createComponent(TestAppTwoColumns);
        const tileNativeElement = fixture.debugElement.nativeElement.querySelector('dt-key-value-list');
        fixture.detectChanges(); // trigger initial data binding
        expect(tileNativeElement).toBeDefined('Element not found');
        expect(tileNativeElement.getAttribute('dt-column') === '2')
          .toBeTruthy('Key Value list must contain 2 columns');
      });
    it('three columns should be used', () => {
        const fixture = TestBed.createComponent(TestAppThreeColumns);
        const tileNativeElement = fixture.debugElement.nativeElement.querySelector('dt-key-value-list');
        fixture.detectChanges(); // trigger initial data binding
        expect(tileNativeElement).toBeDefined('Element not found');
        expect(tileNativeElement.getAttribute('dt-column') === '3')
          .toBeTruthy('Key Value list must contain 3 columns');
      });
  });

  describe('content key value', () => {
    let fixture: ComponentFixture<TestAppSingleColumn>;
    let items: HTMLElement[];

    beforeEach(() => {
      fixture = TestBed.createComponent(TestAppSingleColumn);
      fixture.detectChanges();
      items = fixture.debugElement.nativeElement.querySelectorAll('.dt-key-value-list-item');
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

});

  /** Test component that contains an DtKeyValueList. */

@Component({
  selector: 'dt-test-app',
  template: `
  <dt-key-value-list>
    <dt-key-value-list-item>
      <dt-key-value-list-key>Temp</dt-key-value-list-key><dt-key-value-list-value>1</dt-key-value-list-value>
    </dt-key-value-list-item>
    <dt-key-value-list-item>
      <dt-key-value-list-key>Temp1</dt-key-value-list-key><dt-key-value-list-value>13</dt-key-value-list-value>
    </dt-key-value-list-item>
    <dt-key-value-list-item>
      <dt-key-value-list-key>Temp2</dt-key-value-list-key><dt-key-value-list-value>28</dt-key-value-list-value>
    </dt-key-value-list-item>
  </dt-key-value-list>`,
})
class TestAppSingleColumn {

}

@Component({
    selector: 'dt-disabled-test-app',
    template: `<dt-key-value-list>
     <dt-key-value-list-item>
      <dt-key-value-list-key>Temp</dt-key-value-list-key><dt-key-value-list-value>1</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key>Temp1</dt-key-value-list-key><dt-key-value-list-value>13</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key>Temp2</dt-key-value-list-key><dt-key-value-list-value>28</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key>Temp3</dt-key-value-list-key><dt-key-value-list-value>28</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key>Temp4</dt-key-value-list-key><dt-key-value-list-value>28</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key>Temp5</dt-key-value-list-key><dt-key-value-list-value>28</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key>Temp6</dt-key-value-list-key><dt-key-value-list-value>28</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key>Temp7</dt-key-value-list-key><dt-key-value-list-value>28</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key>Temp8</dt-key-value-list-key><dt-key-value-list-value>28</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key>Temp9</dt-key-value-list-key><dt-key-value-list-value>28</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key>Temp10</dt-key-value-list-key><dt-key-value-list-value>28</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key>Temp11</dt-key-value-list-key><dt-key-value-list-value>28</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key>Temp12</dt-key-value-list-key><dt-key-value-list-value>28</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key>Temp13</dt-key-value-list-key><dt-key-value-list-value>28</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key>Temp14</dt-key-value-list-key><dt-key-value-list-value>28</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key>Temp15</dt-key-value-list-key><dt-key-value-list-value>28</dt-key-value-list-value>
     </dt-key-value-list-item>
  </dt-key-value-list>
    `,
  })
class TestAppTwoColumns {
}

@Component({
    selector: 'dt-test-app3',
    template: `<dt-key-value-list>
     <dt-key-value-list-item>
      <dt-key-value-list-key></dt-key-value-list-key>Temp<dt-key-value-list-value>1</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key></dt-key-value-list-key>Temp1<dt-key-value-list-value>13</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key></dt-key-value-list-key>Temp2<dt-key-value-list-value>24</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key></dt-key-value-list-key>Temp3<dt-key-value-list-value>28</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key></dt-key-value-list-key>Temp4<dt-key-value-list-value>25</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key></dt-key-value-list-key>Temp5<dt-key-value-list-value>28</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key></dt-key-value-list-key>Temp6<dt-key-value-list-value>20</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key></dt-key-value-list-key>Temp7<dt-key-value-list-value>24</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key></dt-key-value-list-key>Temp8<dt-key-value-list-value>22</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key></dt-key-value-list-key>Temp9<dt-key-value-list-value>28</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key></dt-key-value-list-key>Temp10<dt-key-value-list-value>27</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key></dt-key-value-list-key>Temp11<dt-key-value-list-value>28</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key></dt-key-value-list-key>Temp12<dt-key-value-list-value>26</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key></dt-key-value-list-key>Temp13<dt-key-value-list-value>28</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key></dt-key-value-list-key>Temp14<dt-key-value-list-value>28</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key></dt-key-value-list-key>Temp15<dt-key-value-list-value>21</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key></dt-key-value-list-key>Temp16<dt-key-value-list-value>23</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key></dt-key-value-list-key>Temp17<dt-key-value-list-value>28</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key></dt-key-value-list-key>Temp18<dt-key-value-list-value>27</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key></dt-key-value-list-key>Temp19<dt-key-value-list-value>28</dt-key-value-list-value>
     </dt-key-value-list-item>
     <dt-key-value-list-item>
      <dt-key-value-list-key></dt-key-value-list-key>Temp20<dt-key-value-list-value>29</dt-key-value-list-value>
     </dt-key-value-list-item>
  </dt-key-value-list>
    `,
  })
class TestAppThreeColumns {
}
