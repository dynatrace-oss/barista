import { DtFilterFieldNode } from './filter-field-nodes';

export function getDtFilterFieldNodeAddParentAlreadySetError(node: DtFilterFieldNode): Error {
  return Error(`Can not add node ${node.toString()} to a parent or host's root nodes because it has already a parent set.`);
}

export function getDtFilterFieldNodeAddAlreadyInRootError(node: DtFilterFieldNode): Error {
  return Error(`Can not add node ${node.toString()} to parent because it is already set in the host's root nodes`);
}

export function getDtFilterFieldChildNodeRemoveError(node: DtFilterFieldNode): Error {
  return Error(`Can not remove node ${node.toString()} because the parent defined in this node does not have it as a child`);
}
