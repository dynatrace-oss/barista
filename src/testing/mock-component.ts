// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector
import { Component, EventEmitter } from '@angular/core';

/**
 * Examples:
 * MockComponent('some-component');
 * MockComponent('some-component', {inputs: ['some-input', 'some-other-input']});
 */
export function MockComponent(
  selector: string,
  options: Component & { identifier?: any },
): Component {
  const metadata: Component & { identifier: any } = {
    selector,
    identifier: options.identifier,
    template: options.template || '',
    inputs: options.inputs,
    outputs: options.outputs || [],
    exportAs: options.exportAs || '',
  };

  class Mock {}

  metadata.outputs!.forEach(method => {
    Mock.prototype[method] = new EventEmitter<any>();
  });

  if (options.identifier) {
    metadata.providers = [{ provide: options.identifier, useClass: Mock }];
  }

  return Component(metadata)(Mock as any);
}
