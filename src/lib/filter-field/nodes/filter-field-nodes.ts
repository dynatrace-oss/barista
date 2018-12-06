export class DtFilterFieldValueProperty<T> {
  constructor(public value: T, public viewValue: string) {}
  toString(): string { return this.viewValue; }
}

export class DtFilterFieldTextProperty {
  constructor(public value: string) {}
  toString(): string { return `"${this.value}"`; }
}

// tslint:disable-next-line:no-any
export type DtFilterFieldNodeProperty = DtFilterFieldValueProperty<any> | DtFilterFieldTextProperty;

export class DtFilterFieldNode {
  constructor(public parent: DtFilterFieldGroupNode | null = null, public viewValue?: string) {}
  toString(): string { return this.viewValue || ''; }
}

export class DtFilterFieldGroupNode extends DtFilterFieldNode {
  constructor(
    public nodes: DtFilterFieldNode[],
    viewValue?: string,
    parent?: DtFilterFieldGroupNode | null) {
    super(parent, viewValue);
  }
}

export class DtFilterFieldFilterNode extends DtFilterFieldNode {
  constructor(
    public properties: DtFilterFieldNodeProperty[] = [],
    viewValue?: string,
    parent?: DtFilterFieldGroupNode | null) {
    super(parent, viewValue);
  }

  toString(): string {
    // tslint:disable-next-line:no-magic-numbers
    const lastProperties = this.properties.slice(-2);
    return this.viewValue ? this. viewValue :
      (lastProperties.length ?
        (lastProperties.length > 1 ?
          `${lastProperties[0].toString()}: ${lastProperties[1].toString()}` :
          lastProperties[0].toString()
        ) : '');
  }
}

export function getParents(node: DtFilterFieldNode): DtFilterFieldGroupNode[] {
  let currentNode = node;
  const path: DtFilterFieldGroupNode[] = [];
  while (currentNode.parent) {
    path.unshift(currentNode.parent);
    currentNode = currentNode.parent;
  }
  return path;
}
