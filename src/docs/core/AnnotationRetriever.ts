import { Type } from "@angular/core";
import { Arrays } from "@dynatrace/angular-components/core";

// tslint:disable:no-any

declare const Reflect: any;

/**
 * @see: https://stackoverflow.com/a/47453704
 */
export class AnnotationRetriever {

  public static getAnnotation(typeOrFunc: Type<any>): any {
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
      return Arrays.from(Reflect.getOwnMetadata("annotations", typeOrFunc))[0];
    }

    return undefined;
  }

  private static convertTsickleDecoratorIntoMetadata(decoratorInvocations: any[]): any[] {
    if (Arrays.isEmpty(decoratorInvocations)) {
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
