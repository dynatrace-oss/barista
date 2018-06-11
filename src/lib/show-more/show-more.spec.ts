import {async, TestBed} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {DtShowMoreModule, DtShowMore, DtIconModule} from '@dynatrace/angular-components';
import {HttpClientModule} from '@angular/common/http';
import {ENTER, SPACE} from '@angular/cdk/keycodes';

describe('DtShowMore', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DtShowMoreModule,
        HttpClientModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` })],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  describe('show-more', () => {

    let fixture;
    let testComponent: TestApp;
    let instanceDebugElement: DebugElement;
    let instanceElement: HTMLElement;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(TestApp);
      testComponent = fixture.componentInstance;
      fixture.detectChanges();
      instanceDebugElement = fixture.debugElement.query(By.directive(DtShowMore));
      instanceElement = instanceDebugElement.nativeElement;
    }));

    it('should not contain less style', () => {
      expect(instanceElement.classList).not.toContain(
        'dt-show-more-show-less');
    });

    it('should have less styles', () => {
      testComponent.showLess = true;
      fixture.detectChanges();

      expect(instanceElement.classList).toContain(
        'dt-show-more-show-less');
    });

    it('should fire event', () => {
      expect(testComponent.eventsFired).toBe(0);

      instanceElement.click();

      expect(testComponent.eventsFired).toBe(1);
    });

    it('should fire events with keys', () => {
      expect(testComponent.eventsFired).toBe(0);

      const event = new KeyboardEvent('keyup', {
        key: 'Enter',
      });

      // tslint:disable-next-line:no-any
      const anyEvent = event as any;
      delete anyEvent.keyCode;
      Object.defineProperty(anyEvent, 'keyCode', {value: ENTER});

      instanceElement.dispatchEvent(event);

      expect(testComponent.eventsFired).toBe(1);
    });

    it('should prevent space key', () => {
      expect(testComponent.eventsFired).toBe(0);

      const event = new KeyboardEvent('keydown', {
        key: 'Space',
      });
      spyOn(event, 'preventDefault');

      // tslint:disable-next-line:no-any
      const anyEvent = event as any;
      delete anyEvent.keyCode;
      Object.defineProperty(anyEvent, 'keyCode', {value: SPACE});

      instanceElement.dispatchEvent(event);

      // tslint:disable-next-line:no-unbound-method
      expect(event.preventDefault).toHaveBeenCalled();
    });

  });
});

@Component({
  selector: 'dt-test-app',
  template: `<dt-show-more [showLess]="showLess" (changed)="eventFired()">More</dt-show-more>`,
})
class TestApp {
  showLess = false;
  eventsFired = 0;

  eventFired(): void {
    this.eventsFired++;
  }
}
