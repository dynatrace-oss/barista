export class DtFilterFieldNode {
  constructor(public parent: DtFilterFieldGroup | null = null) {}
}

export class DtFilterFieldGroup extends DtFilterFieldNode {
  constructor(
    public nodes: DtFilterFieldNode,
    parent?: DtFilterFieldGroup | null) {
    super(parent);
  }
}

export class DtFilterFieldNodeValue<T> {
  constructor(public value: T, public viewValue: string) {}
}

export class DtFilterFieldNodeText {
  constructor(public value: string) {}
}

// tslint:disable-next-line:no-any
export type DtFilterFieldNodeProperty = DtFilterFieldNodeValue<any> | DtFilterFieldNodeText;

export class DtFilterFieldFilterNode extends DtFilterFieldNode {
  constructor(
    public properties: DtFilterFieldNodeProperty[] = [],
    parent?: DtFilterFieldGroup | null) {
    super(parent);
  }
}

export function getParents(node: DtFilterFieldNode): DtFilterFieldGroup[] {
  let currentNode = node;
  const path: DtFilterFieldGroup[] = [];
  while (currentNode.parent) {
    path.unshift(currentNode.parent);
    currentNode = currentNode.parent;
  }
  return path;
}
