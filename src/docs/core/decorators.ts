import { Type } from '@angular/core';
export function OriginalClassName<T>(className: string): (a: Type<T>) => void {
  return (constructor: Type<T>) => {
    Object.defineProperty(constructor, 'originalClassName', {
      value: className,
      enumerable: false,
      writable: false,
      configurable: true,
    });
  };
}
