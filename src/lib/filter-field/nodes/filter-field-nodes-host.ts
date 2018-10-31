import { DtFilterFieldNode, DtFilterFieldNodeGroup } from './filter-field-nodes';
import {
  getDtFilterFieldChildNodeRemoveError,
  getDtFilterFieldNodeAddParentAlreadySetError,
  getDtFilterFieldNodeAddAlreadyInRootError
} from './filter-field-nodes-errors';

export class DtFilterFieldNodesHost {
  private _rootNodes: Set<DtFilterFieldNode>;

  get rootNodes(): DtFilterFieldNode[] { return Array.from(this._rootNodes); }

  constructor(nodes?: DtFilterFieldNode[]) {
    this._rootNodes = new Set<DtFilterFieldNode>(nodes);
  }

  addNode(node: DtFilterFieldNode, parent?: DtFilterFieldNodeGroup): void {
    if (!node.parent) {
      if (parent) {
        if (this._rootNodes.has(node)) {
          throw getDtFilterFieldNodeAddAlreadyInRootError(node);
        }
        parent.nodes.push(node);
        node.parent = parent;
      } else {
        this._rootNodes.add(node);
      }
    } else {
      throw getDtFilterFieldNodeAddParentAlreadySetError(node);
    }
  }

  removeNode(node: DtFilterFieldNode): void {
    if (node.parent) {
      this._removeChildNode(node);
    } else {
      this._rootNodes.delete(node);
    }
  }

  private _removeChildNode(node: DtFilterFieldNode): void {
    const parent = node.parent!;
    const nodeIndex = parent.nodes.indexOf(node);
    if (nodeIndex !== -1) {
      parent.nodes.splice(nodeIndex, 1);
      node.parent = null;
    } else {
      throw getDtFilterFieldChildNodeRemoveError(node);
    }
  }
}
