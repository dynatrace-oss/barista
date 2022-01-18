/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DtExpandableTextModule } from './expandable-text-module';
import { DtExpandableText } from './expandable-text';

import { createComponent, dispatchFakeEvent } from '@dynatrace/testing/browser';

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
    expandableTextInstance =
      instanceDebugElement.injector.get<DtExpandableText>(DtExpandableText);
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
    const collapsedSubscription =
      instance._textCollapsed.subscribe(collapsedSpy);
    const changedSubscription = instance.expandChanged.subscribe(changedSpy);

    expandableTextInstance.close();
    fixture.detectChanges();
    expect(collapsedSpy).toHaveBeenCalled();
    expect(changedSpy).toHaveBeenCalled();

    collapsedSubscription.unsubscribe();
    changedSubscription.unsubscribe();
  });

  // check aria-controls attribute
  it('should have the correct aria-controls attribute', () => {
    const triggerInstanceElement = fixture.debugElement.query(
      By.css('.dt-expandable-text-trigger'),
    ).nativeElement;

    expect(triggerInstanceElement.getAttribute('aria-controls')).toMatch(
      /dt-expandable-text-\d/,
    );
  });

  it('should have the correct aria-controls attribute when using ID input', () => {
    fixture.componentInstance.id = 'my-text';
    fixture.detectChanges();

    const triggerInstanceElement = fixture.debugElement.query(
      By.css('.dt-expandable-text-trigger'),
    ).nativeElement;

    expect(triggerInstanceElement.getAttribute('aria-controls')).toBe(
      'my-text',
    );
  });

  it('should fall back to the default id when ID is unset', () => {
    fixture.componentInstance.id = 'my-text';
    fixture.detectChanges();

    fixture.componentInstance.id = null;
    fixture.detectChanges();

    const triggerInstanceElement = fixture.debugElement.query(
      By.css('.dt-expandable-text-trigger'),
    ).nativeElement;

    expect(triggerInstanceElement.getAttribute('aria-controls')).toMatch(
      /dt-expandable-text-\d/,
    );
  });

  // check if it has the correct aria-expanded attribute
  it('should have the correct aria-expanded attribute', () => {
    const triggerInstanceElement = fixture.debugElement.query(
      By.css('.dt-expandable-text-trigger'),
    ).nativeElement;

    expect(triggerInstanceElement.getAttribute('aria-expanded')).toBe('false');
  });

  // check if it has the correct aria-expanded attribute is set after expanding
  it('should have the correct aria-expanded attribute after opening the expandable', () => {
    const triggerInstanceElement = fixture.debugElement.query(
      By.css('.dt-expandable-text-trigger'),
    ).nativeElement;

    expandableTextInstance.open();
    fixture.detectChanges();

    expect(triggerInstanceElement.getAttribute('aria-expanded')).toBe('true');
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
    <dt-expandable-text label="more" labelClose="less" [id]="id"
      >text</dt-expandable-text
    >
  `,
})
class ExpandableTextComponent {
  id: string | null;
}
