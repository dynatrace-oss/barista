import { Component } from '@angular/core';
import { DtThemingModule } from './index';
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

describe('DtTheme', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtThemingModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  it('should apply the dt-theme class', () => {
    const fixture = TestBed.createComponent(TestApp);
    const sectionDebugElement = fixture.debugElement.query(By.css('section'));
    fixture.detectChanges();

    expect(sectionDebugElement.nativeElement.classList.contains('dt-theme')).toBeTruthy();
  });

  it('should apply the corrent class if a name is set', () => {
    const fixture = TestBed.createComponent(TestApp);
    const testComponent = fixture.debugElement.componentInstance;
    const sectionDebugElement = fixture.debugElement.query(By.css('section'));
    fixture.detectChanges();
    expect(sectionDebugElement.nativeElement.classList.contains('dt-theme-turquoise')).toBeTruthy();

    testComponent.theme = 'royalblue:light';
    fixture.detectChanges();
    expect(sectionDebugElement.nativeElement.classList.contains('dt-theme-royalblue')).toBeTruthy();

    testComponent.theme = 'turquoise:dark';
    fixture.detectChanges();
    expect(sectionDebugElement.nativeElement.classList.contains('dt-theme-turquoise')).toBeTruthy();

    testComponent.theme = ':dark';
    fixture.detectChanges();
    expect(sectionDebugElement.nativeElement.classList.contains('dt-theme-turquoise')).toBeFalsy();
  });

  it('should apply the corrent class if a variant is set', () => {
    const fixture = TestBed.createComponent(TestApp);
    const testComponent = fixture.debugElement.componentInstance;
    const sectionDebugElement = fixture.debugElement.query(By.css('section'));
    fixture.detectChanges();
    expect(sectionDebugElement.nativeElement.classList.contains('dt-theme-light')).toBeFalsy();
    expect(sectionDebugElement.nativeElement.classList.contains('dt-theme-dark')).toBeFalsy();

    testComponent.theme = 'turquoise:light';
    fixture.detectChanges();
    expect(sectionDebugElement.nativeElement.classList.contains('dt-theme-light')).toBeTruthy();
    expect(sectionDebugElement.nativeElement.classList.contains('dt-theme-dark')).toBeFalsy();

    testComponent.theme = 'turquoise:dark';
    fixture.detectChanges();
    expect(sectionDebugElement.nativeElement.classList.contains('dt-theme-light')).toBeFalsy();
    expect(sectionDebugElement.nativeElement.classList.contains('dt-theme-dark')).toBeTruthy();
  });
});

@Component({
  selector: 'dt-test-app',
  template: `<section [dtTheme]="theme"></section>`,
})
class TestApp {
  theme = 'turquoise';
}
