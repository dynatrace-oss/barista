import { CdkPortal } from '@angular/cdk/portal';
import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

/**
 * Directive to be able to render the given label inside the portaloutlet
 */
@Directive({
  selector: '[dtTabLabel]',
  exportAs: 'dtTabLabel',
})
export class DtTabLabel extends CdkPortal {
  constructor(
    // tslint:disable-next-line:no-any
    templateRef: TemplateRef<any>,
    viewContainerRef: ViewContainerRef,
  ) {
    super(templateRef, viewContainerRef);
  }
}
