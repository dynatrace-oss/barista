import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Type } from '@angular/core';

/** Use this function instead of `TestBed.createComponent` to ensure Change Detection has finished before accessing properties. */
export function createComponent<T>(component: Type<T>): ComponentFixture<T> {
  const fixture = TestBed.createComponent(component);
  fixture.detectChanges();
  return fixture;
}
