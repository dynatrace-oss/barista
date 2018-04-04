import { Type } from '@angular/core';

// tslint:disable:no-any
declare const Reflect: any;

/**
 * @see: https://stackoverflow.com/a/47453704
 */
// tslint:disable-next-line:no-unnecessary-class
export class AnnotationRetriever {

  static getAnnotation(typeOrFunc: Type<any>): any {
    // Prefer the direct API.
    if ((typeOrFunc as any).__annotations__) {
      return (typeOrFunc as any).__annotations__[0];
    }

    // API of tsickle for lowering decorators to properties on the class.
    if ((typeOrFunc as any).decorators) {
      return AnnotationRetriever.convertTsickleDecoratorIntoMetadata((typeOrFunc as any).decorators)[0];
    }

    // API for metadata created by invoking the decorators.
    if (Reflect && Reflect.getOwnMetadata) {
      return Array.from(Reflect.getOwnMetadata('annotations', typeOrFunc))[0];
    }

    return undefined;
  }

  static convertTsickleDecoratorIntoMetadata(decoratorInvocations: any[]): any[] {
    if (!decoratorInvocations || decoratorInvocations.length === 0) {
      return [];
    }

    return decoratorInvocations.map((decoratorInvocation: any) => {
      const decoratorType = decoratorInvocation.type;
      const annotationCls = decoratorType.annotationCls;
      const annotationArgs = decoratorInvocation.args ? decoratorInvocation.args : [];

      return new annotationCls(...annotationArgs);
    });
  }

}
