// enum DtFilterFieldTextNodeType {
//   KeyValue,
//   FreeText,
// }

// interface DtFilterFieldTextNode {
//   type: DtFilterFieldTextNodeType;
//   label: string;
//   value: string;
// }

// interface DtFilterFieldNodeList {
//   nodes: any[];
// }

// enum DtFilterFieldOperatorNodeType {
//   AND = 'AND',
//   OR = 'OR',
//   NOT = 'NOT',
//   IN = 'IN',
// }

// interface DtFilterFieldOperatorNode {
//   type: DtFilterFieldOperatorNodeType;
// }

export class DtFilterFieldNodeValue<T> {
  constructor(public value: T, public viewValue: string) {}
}

export class DtFilterFieldNodeText {
  constructor(public value: string) {}
}

// tslint:disable-next-line:no-any
export type DtFilterFieldNodeProperty = DtFilterFieldNodeValue<any> | DtFilterFieldNodeText;

export class DtFilterFieldNode {
  constructor(public properties: DtFilterFieldNodeProperty[] = []) {}
}
