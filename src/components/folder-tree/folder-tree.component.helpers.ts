import { ItemNode, TreeNode } from '../../models/schemas';

export function findItemNodeById(id: number, root: TreeNode): ItemNode | undefined {
  function findItemOnNode(node: TreeNode) {
    return node.items.find((item) => item.id === id);
  }

  function traverse(node: TreeNode): ItemNode | undefined {
    const item = findItemOnNode(node);
    if (item) {
      return item;
    }

    for (let child of node.children) {
      const item = traverse(child);
      if (item) {
        return item;
      }
    }

    return undefined;
  }

  return traverse(root);
}

export function updateAllChildNodes(node: TreeNode, selected: boolean, folderTree: TreeNode) {
  function traverseDown(node: TreeNode, selected: boolean) {
    if (node.children.length > 0) {
      node.children.forEach((child) => {
        child.selected = selected;
        traverseDown(child, selected);
      });
    }

    if (node.items.length > 0) {
      node.items.forEach((item) => {
        const itemToUpdate = findItemNodeById(item.id, folderTree);
        if (itemToUpdate) {
          itemToUpdate.selected = selected;
        }
      });
    }
  }

  traverseDown(node, selected);
}

export function getAllSelectedItems(root: TreeNode) {
  let selectedIds: number[] = [];

  function traverseDown(node: TreeNode) {
    if (!node) {
      return;
    }

    if (node.items.length > 0) {
      node.items.forEach((item) => {
        if (item.selected) {
          selectedIds = [...selectedIds, item.id];
        }
      });
    }

    if (node.children.length > 0) {
      node.children.forEach((child) => {
        traverseDown(child);
      });
    }

    return selectedIds;
  }

  return traverseDown(root);
}

export function setNodeStates(node: TreeNode) {
  const anySelected = node.items.some((item) => item.selected);
  const allSelected = node.items.every((item) => item.selected);
  const noneSelected = !node.items.every((item) => item.selected);

  if (anySelected && !allSelected) {
    node.indeterminate = true;
    node.selected = false;
    return;
  }

  node.indeterminate = false;
  if (allSelected) {
    node.selected = true;
  }

  if (noneSelected) {
    node.selected = false;
  }
}

export function updateFolderCheckBoxStates(root: TreeNode) {
  const rootCopy = structuredClone(root);
  function traverseTree(node: TreeNode) {
    if (node.items.length > 0) {
      setNodeStates(node);
    }

    if (node.children.length > 0) {
      node.children.forEach((child) => {
        traverseTree(child);
      });
    }

    return node;
  }
  return traverseTree(rootCopy);
}
