import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  DtExpandableText,
  DtExpandableTextModule,
} from '@dynatrace/angular-components/expandable-text';

import { createComponent } from '../../testing/create-component';
// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector
import { dispatchFakeEvent } from '../../testing/dispatch-events';

/**
 * insert your tests here
 */
describe('dt-expandable-text', () => {
  let fixture;
  let instanceDebugElement: DebugElement;
  let expandableTextInstance: DtExpandableText;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DtExpandableTextModule],
      declarations: [ExpandableTextComponent],
    });
    TestBed.compileComponents();

    fixture = createComponent(ExpandableTextComponent);
    instanceDebugElement = fixture.debugElement.query(
      By.directive(DtExpandableText),
    );
    expandableTextInstance = instanceDebugElement.injector.get<
      DtExpandableText
    >(DtExpandableText);
  });

  it('should be closed initially', () => {
    expect(expandableTextInstance.expanded).toBe(false);
    checkTextVisibility(false, fixture);
  });

  it('should be expanded', () => {
    expandableTextInstance.open();
    fixture.detectChanges();
    expect(expandableTextInstance.expanded).toBe(true);
    checkTextVisibility(true, fixture);
  });

  it('should be expanded when collapsed on toggle', () => {
    expandableTextInstance.toggle();
    fixture.detectChanges();
    expect(expandableTextInstance.expanded).toBe(true);
  });

  it('should be collapsed when expanded on toggle', () => {
    expandableTextInstance.expanded = true;
    expandableTextInstance.toggle();
    fixture.detectChanges();
    expect(expandableTextInstance.expanded).toBe(false);
  });

  it('should toggle when method toggle() is called', () => {
    checkTextVisibility(false, fixture);
    expandableTextInstance.toggle();
    fixture.detectChanges();
    checkTextVisibility(true, fixture);
    expandableTextInstance.toggle();
    fixture.detectChanges();
    checkTextVisibility(false, fixture);
  });

  it('expandable text should be visible', () => {
    expandableTextInstance.open();
    fixture.detectChanges();
    checkTextVisibility(true, fixture);
  });

  it("expandable text shouldn't be visible", () => {
    expandableTextInstance.close();
    fixture.detectChanges();
    checkTextVisibility(false, fixture);
  });

  it('should show content when more button is clicked', () => {
    checkTextVisibility(false, fixture);
    const button = fixture.debugElement.query(
      By.css('.dt-expandable-text-trigger'),
    );
    const buttonElement = button.nativeElement;
    dispatchFakeEvent(buttonElement, 'click');
    fixture.detectChanges();
    checkTextVisibility(true, fixture);
  });

  it('should hide content when less button is clicked', () => {
    expandableTextInstance.open();
    fixture.detectChanges();
    checkTextVisibility(true, fixture);
    const button = fixture.debugElement.query(
      By.css('.dt-expandable-text-trigger'),
    );
    const buttonElement = button.nativeElement;
    dispatchFakeEvent(buttonElement, 'click');
    fixture.detectChanges();
    checkTextVisibility(false, fixture);
  });

  it('should fire expanded when expandChanged events on open', () => {
    const expandedSpy = jest.fn();
    const changedSpy = jest.fn();
    const instance: DtExpandableText = instanceDebugElement.componentInstance;
    const expandedSubscription = instance._textExpanded.subscribe(expandedSpy);
    const changedSubscription = instance.expandChanged.subscribe(changedSpy);

    expandableTextInstance.open();
    fixture.detectChanges();
    expect(expandedSpy).toHaveBeenCalled();
    expect(changedSpy).toHaveBeenCalled();

    expandedSubscription.unsubscribe();
    changedSubscription.unsubscribe();
  });

  it('should fire collapsed when expandChanged events on close', () => {
    const collapsedSpy = jest.fn();
    const changedSpy = jest.fn();
    const instance: DtExpandableText = instanceDebugElement.componentInstance;
    const collapsedSubscription = instance._textCollapsed.subscribe(
      collapsedSpy,
    );
    const changedSubscription = instance.expandChanged.subscribe(changedSpy);

    expandableTextInstance.close();
    fixture.detectChanges();
    expect(collapsedSpy).toHaveBeenCalled();
    expect(changedSpy).toHaveBeenCalled();

    collapsedSubscription.unsubscribe();
    changedSubscription.unsubscribe();
  });
});

function checkTextVisibility<T>(
  visible: boolean,
  fixture: ComponentFixture<T>,
): void {
  const nativeElement = fixture.nativeElement.textContent;
  if (visible) {
    expect(nativeElement.trim()).toBe('text less');
  } else {
    expect(nativeElement.trim()).toBe('more');
  }
}

/** Test component that contains an DtExpandableText. */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-expandable-text label="more" labelClose="less">text</dt-expandable-text>
  `,
})
class ExpandableTextComponent {}
