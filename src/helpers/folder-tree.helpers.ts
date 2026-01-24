import { Folder, FolderData, ItemNode, TreeNode } from '../models/schemas';

export function treeNodeBuilder(folderData: FolderData) {
  const foldersData: Folder[] = [...folderData.folders.data];
  const folderTree: TreeNode = {
    id: 0,
    name: 'root',
    children: [],
    items: [],
    selected: false,
    indeterminate: false,
  };

  foldersData.forEach((currentFolderData) => {
    const [id, name, parentId] = currentFolderData;
    const newFolderNode: TreeNode = {
      id,
      name,
      children: [],
      items: [],
      selected: false,
      indeterminate: false,
    };

    // If folder has no parent, add to root node's children
    if (parentId === null) {
      folderTree.children = [...folderTree.children, newFolderNode];
      folderTree.children.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      return;
    }

    // NOTE: Upon studying the order of the array, it very much looks like we can assume we make sure in the backend service that
    // when the next item in folderData is handled, its parent already exists.
    // So there is no need to handle the case if it doesn't, making the algorithm simpler and more efficient.

    // Find parent folder and add the folder to its children
    const parentFolder = findNodeById(parentId, folderTree);
    if (parentFolder) {
      parentFolder.children = [...parentFolder.children, newFolderNode];
      parentFolder.children = sortTreeNodesByName(parentFolder.children);
      return;
    }
  });

  return folderTree;
}

export function itemFiller(folderData: FolderData, folderTree: TreeNode) {
  const folderTreeClone = structuredClone(folderTree);
  const itemsData = [...folderData.items.data];

  itemsData.forEach((currentItem) => {
    const [id, name, folderId] = currentItem;
    const newItemNode: ItemNode = {
      id,
      name,
      selected: false,
    };

    const itemParentFolder = findNodeById(folderId, folderTreeClone);
    if (itemParentFolder) {
      itemParentFolder.items = [...itemParentFolder.items, newItemNode];
      itemParentFolder.items = sortItemNodesByName(itemParentFolder.items);
    }
  });

  return folderTreeClone;
}

export function findNodeById(id: number, root: TreeNode): TreeNode | undefined {
  function traverse(node: TreeNode): any {
    if (node.id === id) {
      return node;
    }

    for (const child of node.children) {
      const result = traverse(child);
      if (result) {
        return result;
      }
    }
  }

  return traverse(root);
}

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

export function updateChildNodes(node: TreeNode, selected: boolean, folderTree: TreeNode) {
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

// TODO: make these function into one generic sorting function
export function sortTreeNodesByName(nodes: TreeNode[]): TreeNode[] {
  const nodesCopy = [...nodes];
  nodesCopy.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  return nodesCopy;
}

export function sortItemNodesByName(items: ItemNode[]): ItemNode[] {
  const itemsCopy = [...items];
  itemsCopy.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  return itemsCopy;
}
