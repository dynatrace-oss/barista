
import {async, TestBed} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {DtPaginationModule, DtPagination} from './index';
import {DtIconModule} from '../icon/index';
import {HttpClientModule} from '@angular/common/http';

function extractNumbers(elementList: HTMLElement[]): string {
  const result: string[] = [];
  expect(elementList).toBeTruthy();
  for (const element of elementList) {
    if (element.classList.contains('dt-pagination-item-active')) {
      result.push(`(${element.innerText.trim()})`);
    } else if (element.classList.contains('dt-pagination-item-ellipsis')) {
      result.push('...');
    } else {
      result.push(element.innerText.trim());
    }
  }
  return result.join(' ');
}

describe('DtPagination', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DtPaginationModule,
        HttpClientModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` })],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  let fixture;
  let testComponent: TestApp;

  let debugElement: DebugElement;

  let instance: DtPagination;

  function setPage(page: number): void {
    instance.currentPage = page;
    fixture.detectChanges();
  }

  function getNumbersString(): string {
    const tileNativeElements = fixture.debugElement.nativeElement.querySelectorAll('.dt-pagination-numbers > *');
    return extractNumbers(Array.from(tileNativeElements));
  }

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TestApp);
    fixture.detectChanges();

    testComponent = fixture.debugElement.componentInstance;

    debugElement = fixture.debugElement.query(By.directive(DtPagination));
    instance = debugElement.injector.get<DtPagination>(DtPagination);
  }));

  it('should exist', () => {
    expect(instance).toBeTruthy();
  });

  it('has arrows', () => {
    const tileNativeElement1 = fixture.debugElement.nativeElement.querySelector('.dt-pagination-arrow:first-child');
    expect(tileNativeElement1).toBeTruthy();

    const tileNativeElement2 = fixture.debugElement.nativeElement.querySelector('.dt-pagination-arrow:last-child');
    expect(tileNativeElement2).toBeTruthy();

    expect(tileNativeElement1).not.toEqual(tileNativeElement2);
  });

  it('has arrow disabled and not disabled', () => {
    const tileNativeElement1 = fixture.debugElement.nativeElement.querySelector('.dt-pagination-arrow:first-child');
    expect(tileNativeElement1.disabled).toBe(true);

    const tileNativeElement2 = fixture.debugElement.nativeElement.querySelector('.dt-pagination-arrow:last-child');
    expect(tileNativeElement2.disabled).toBe(false);
  });

  it('has first arrow not disabled', () => {
    const tileNativeElement1 = fixture.debugElement.nativeElement.querySelector('.dt-pagination-arrow:first-child');
    expect(tileNativeElement1.disabled).toBe(true);

    setPage(2);

    expect(tileNativeElement1.disabled).toBe(false);
  });

  it('has last arrow disabled', () => {
    const tileNativeElement1 = fixture.debugElement.nativeElement.querySelector('.dt-pagination-arrow:last-child');
    expect(tileNativeElement1.disabled).toBe(false);

    setPage(5);

    expect(tileNativeElement1.disabled).toBe(true);
  });

  it('has item active', () => {
    let tileNativeElement = fixture.debugElement.nativeElement.querySelector('.dt-pagination-item-active');
    expect(tileNativeElement).toBeTruthy();
    expect(tileNativeElement.innerText).toEqual('1');

    setPage(3);

    tileNativeElement = fixture.debugElement.nativeElement.querySelector('.dt-pagination-item-active');
    expect(tileNativeElement).toBeTruthy();
    expect(tileNativeElement.innerText).toEqual('3');
  });

  it('has element list', () => {
    expect(getNumbersString()).toBe('(1) 2 3 4 5');
    setPage(2);
    expect(getNumbersString()).toBe('1 (2) 3 4 5');
    setPage(3);
    expect(getNumbersString()).toBe('1 2 (3) 4 5');
    setPage(5);
    expect(getNumbersString()).toBe('1 2 3 4 (5)');
  });

  it('has dots', () => {
    instance.maxPages = 11;
    fixture.detectChanges();
    expect(getNumbersString()).toBe('(1) 2 3 ... 9 10 11');
    setPage(2);
    expect(getNumbersString()).toBe('1 (2) 3 ... 9 10 11');
    setPage(3);
    expect(getNumbersString()).toBe('1 2 (3) 4 ... 10 11');
    setPage(4);
    expect(getNumbersString()).toBe('1 2 3 (4) 5 ... 11');
    setPage(5);
    expect(getNumbersString()).toBe('1 ... 4 (5) 6 ... 11');
    setPage(7);
    expect(getNumbersString()).toBe('1 ... 6 (7) 8 ... 11');
    setPage(8);
    expect(getNumbersString()).toBe('1 ... 7 (8) 9 10 11');
    setPage(9);
    expect(getNumbersString()).toBe('1 2 ... 8 (9) 10 11');
    setPage(10);
    expect(getNumbersString()).toBe('1 2 3 ... 9 (10) 11');
    setPage(11);
    expect(getNumbersString()).toBe('1 2 3 ... 9 10 (11)');

    instance.maxPages = 81;
    fixture.detectChanges();

    expect(getNumbersString()).toBe('1 ... 10 (11) 12 ... 81');
  });

  it('should fire events for arrows', () => {
    expect(testComponent.firedEvents).toBe(0);
    const tileNativeElement1 = fixture.debugElement.nativeElement.querySelector('.dt-pagination-arrow:last-child');
    tileNativeElement1.click();
    expect(testComponent.firedEvents).toBe(1);
    expect(testComponent.currentSelection).toBe(2);
  });

  it('should fire events for numbers', () => {
    expect(testComponent.firedEvents).toBe(0);
    const tileNativeElement1 = fixture.debugElement.nativeElement.querySelector('.dt-pagination-numbers > button:last-child');
    tileNativeElement1.click();
    expect(testComponent.firedEvents).toBe(1);
    expect(testComponent.currentSelection).toBe(5);
  });

});

@Component({
  selector: 'dt-test-app',
  template: `<dt-pagination [maxPages]="5" (changed)="onChange($event)"></dt-pagination>`,
})
class TestApp {

  currentSelection: number;
  firedEvents = 0;

  onChange(value: number): void {
    this.firedEvents++;
    this.currentSelection = value;
  }
}
