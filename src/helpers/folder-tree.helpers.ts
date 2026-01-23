import { Folder, FolderData } from '../models/schemas';
import { ItemNode, TreeNode } from '../models/types';

export function treeNodeBuilder(folderData: FolderData) {
  const foldersData: Folder[] = [...folderData.folders.data];
  const folderTree: TreeNode = { id: 0, name: 'root', children: [], items: [] };

  foldersData.forEach((currentFolderData) => {
    const [id, name, parentId] = currentFolderData;
    const newFolderNode: TreeNode = {
      id,
      name,
      children: [],
      items: [],
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
    // So there is no need to handle the case if it doesn't, making the algorithm more efficient.

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
    const newItemNodeToAdd: ItemNode = {
      id,
      name,
    };

    const itemParentFolder = findNodeById(folderId, folderTreeClone);
    if (itemParentFolder) {
      itemParentFolder.items = [...itemParentFolder.items, newItemNodeToAdd];
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
