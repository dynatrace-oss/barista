export class DtFilterFieldNode {
  constructor(public parent: DtFilterFieldNodeGroup | null = null, public viewValue?: string) {}
  toString(): string { return this.viewValue || ''; }
}

export class DtFilterFieldNodeGroup extends DtFilterFieldNode {
  constructor(
    public nodes: DtFilterFieldNode[],
    viewValue?: string,
    parent?: DtFilterFieldNodeGroup | null) {
    super(parent, viewValue);
  }
}

export class DtFilterFieldNodeValue<T> {
  constructor(public value: T, public viewValue: string) {}
  toString(): string { return this.viewValue; }
}

export class DtFilterFieldNodeText {
  constructor(public value: string) {}
  toString(): string { return `"${this.value}"`; }
}

// tslint:disable-next-line:no-any
export type DtFilterFieldNodeProperty = DtFilterFieldNodeValue<any> | DtFilterFieldNodeText;

export class DtFilterFieldFilterNode extends DtFilterFieldNode {
  constructor(
    public properties: DtFilterFieldNodeProperty[] = [],
    viewValue?: string,
    parent?: DtFilterFieldNodeGroup | null) {
    super(parent, viewValue);
  }

  toString(): string {
    // tslint:disable-next-line:no-magic-numbers
    const lastNodes = this.properties.slice(-2);
    return this.viewValue ? this. viewValue :
      (lastNodes.length ?
        (lastNodes.length > 1 ? `${lastNodes[0].toString()}: ${lastNodes[1].toString()}` : lastNodes[0].toString()) : '');
  }
}

export function getParents(node: DtFilterFieldNode): DtFilterFieldNodeGroup[] {
  let currentNode = node;
  const path: DtFilterFieldNodeGroup[] = [];
  while (currentNode.parent) {
    path.unshift(currentNode.parent);
    currentNode = currentNode.parent;
  }
  return path;
}
