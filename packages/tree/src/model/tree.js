import Node from './node';

export default class Tree {
  constructor(options) {
    for (let option in options) {
      if (options.hasOwnProperty(option)) {
        this[option] = options[option];
      }
    }

    this.nodesMap = {};

    this.root = new Node({
      data: this.data,
      _tree: this
    });

    if (this.lazy && this.load) {
      const loadFn = this.load;
      loadFn(this.root, (data) => {
        this.root.doCreateChildren(data);
        this._initDefaultCheckedNodes();
      });
    } else {
      this._initDefaultCheckedNodes();
    }
  }

  setData(newVal) {
    const instanceChanged = newVal !== this.root.data;
    this.root.setData(newVal);
    if (instanceChanged) {
      this._initDefaultCheckedNodes();
    }
  }

  _initDefaultCheckedNodes() {
    const defaultCheckedKeys = this.defaultCheckedKeys || [];
    const nodesMap = this.nodesMap;

    defaultCheckedKeys.forEach((checkedKey) => {
      const node = nodesMap[checkedKey];

      if (node) {
        node.setChecked(true, !this.checkStrictly);
      }
    });
  }

  _initDefaultCheckedNode(node) {
    const defaultCheckedKeys = this.defaultCheckedKeys || [];

    if (defaultCheckedKeys.indexOf(node.key) !== -1) {
      node.setChecked(true, !this.checkStrictly);
    }
  }

  setDefaultCheckedKey(newVal) {
    if (newVal !== this.defaultCheckedKeys) {
      this.defaultCheckedKeys = newVal;
      this._initDefaultCheckedNodes();
    }
  }

  registerNode(node) {
    const key = this.key;
    if (!key || !node || !node.data) return;

    const nodeKey = node.key;
    if (nodeKey) this.nodesMap[node.key] = node;
  }

  deregisterNode(node) {
    const key = this.key;
    if (!key || !node || !node.data) return;

    delete this.nodesMap[node.key];
  }

  getCheckedNodes(leafOnly) {
    const checkedNodes = [];
    const traverse = function(node) {
      const childNodes = node.root ? node.root.childNodes : node.childNodes;

      childNodes.forEach((child) => {
        if ((!leafOnly && child.checked) || (leafOnly && child.isLeaf && child.checked)) {
          checkedNodes.push(child.data);
        }

        traverse(child);
      });
    };

    traverse(this);

    return checkedNodes;
  }

  getCheckedKeys(leafOnly) {
    const key = this.key;
    const allNodes = this._getAllNodes();
    const keys = [];
    allNodes.forEach((node) => {
      if (!leafOnly || (leafOnly && node.isLeaf)) {
        if (node.checked) {
          keys.push((node.data || {})[key]);
        }
      }
    });
    return keys;
  }

  _getAllNodes() {
    const allNodes = [];
    const nodesMap = this.nodesMap;
    for (let nodeKey in nodesMap) {
      if (nodesMap.hasOwnProperty(nodeKey)) {
        allNodes.push(nodesMap[nodeKey]);
      }
    }

    return allNodes;
  }

  _setCheckedKeys(key, leafOnly, checkedKeys) {
    const allNodes = this._getAllNodes();

    allNodes.sort((a, b) => a.level > b.level ? -1 : 1);
    allNodes.forEach((node) => {
      if (!leafOnly || (leafOnly && node.isLeaf)) {
        node.setChecked(!!checkedKeys[(node.data || {})[key]], !this.checkStrictly);
      }
    });
  }

  setCheckedNodes(array, leafOnly = true) {
    const key = this.key;
    const checkedKeys = {};
    array.forEach((item) => {
      checkedKeys[(item || {})[key]] = true;
    });

    this._setCheckedKeys(key, leafOnly, checkedKeys);
  }

  setCheckedKeys(keys, leafOnly = true) {
    const key = this.key;
    const checkedKeys = {};
    keys.forEach((key) => {
      checkedKeys[key] = true;
    });

    this._setCheckedKeys(key, leafOnly, checkedKeys);
  }
};
