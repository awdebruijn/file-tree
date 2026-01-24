import { ItemNode, TreeNode } from '../../models/schemas';

// TODO: write unit tests
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

export function updateFolderCheckBoxStates(root: TreeNode) {
  const rootCopy = structuredClone(root);

  // we want to know for all its items and all the items of its children and children's children what the selected states are:
  // if any, all, or none are selected, then update the node's checkbox state
  // after that, go down to its children and do the same

  function setNodeStateBasedOnAllChildItems(node: TreeNode) {
    // step 1
    // collect all the items down the tree in an array
    function getAllBranchItems(node: TreeNode, initialCollectedItems: ItemNode[]): ItemNode[] {
      let collectedItems = [...initialCollectedItems];
      if (node.items.length > 0) {
        collectedItems = [...collectedItems, ...node.items];
      }

      if (node.children.length > 0) {
        for (let child of node.children) {
          collectedItems = [...getAllBranchItems(child, collectedItems)];
        }
      }

      return collectedItems;
    }

    // then deduce the node state from them
    setNodeCheckBoxStates(node, getAllBranchItems(node, []));

    // step 2
    // do the same for each child of the node
    if (node.children.length > 0) {
      for (let child of node.children) {
        setNodeStateBasedOnAllChildItems(child);
      }
    }

    return node;
  }

  return setNodeStateBasedOnAllChildItems(rootCopy);
}

export function setNodeCheckBoxStates(node: TreeNode, allItems: ItemNode[]) {
  const anySelected = allItems.some((item) => item.selected);
  const allSelected = allItems.every((item) => item.selected);
  const noneSelected = !allItems.every((item) => item.selected);

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
