enum DtFilterFieldTextNodeType {
  KeyValue,
  FreeText,
}

interface DtFilterFieldTextNode {
  type: DtFilterFieldTextNodeType;
  label: string;
  value: string;
}

interface DtFilterFieldNodeList {
  nodes: any[];
}

enum DtFilterFieldOperatorNodeType {
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
  IN = 'IN',
}

interface DtFilterFieldOperatorNode {
  type: DtFilterFieldOperatorNodeType;
}
