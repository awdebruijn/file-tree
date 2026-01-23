import { Component, inject } from '@angular/core';
import { FolderTreeComponent } from '../../components/folder-tree/folder-tree.component';
import { WareHouseService } from '../../services/ware-house.service';
import { Folder, FolderData } from '../../models/schemas';

@Component({
  selector: 'app-home',
  imports: [FolderTreeComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true,
})
export class Home {
  wareHouseService = inject(WareHouseService);

  constructor() {
    this.wareHouseService.getFolderStructure().subscribe({
      next: (data: FolderData) => {
        const folderTree = this.treeNodeBuilder(data);
        console.log(this.itemFiller(data, folderTree));
      },
      error: (error: any) => {
        console.error('Error fetching folder structure:', error);
      },
    });
  }

  treeNodeBuilder(folderData: FolderData) {
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
        return;
      }

      // NOTE: Upon studying the order of the array, it very much looks like we can assume we make sure in the backend service that
      // when the next item in folderData is handled, its parent already exists.
      // So there is no need to handle the case if it doesn't, making the algorithm more efficient.

      // Find parent folder and add the folder to its children
      const parentFolder = this.findNodeById(parentId, folderTree);
      if (parentFolder) {
        parentFolder.children = [...parentFolder.children, newFolderNode];
        return;
      }
    });

    return folderTree;
  }

  itemFiller(folderData: FolderData, folderTree: TreeNode) {
    const folderTreeClone = structuredClone(folderTree);
    const itemsData = [...folderData.items.data];

    itemsData.forEach((currentItem) => {
      const [id, name, folderId] = currentItem;
      const newItemNodeToAdd: ItemNode = {
        id,
        name,
      };

      const itemParentFolder = this.findNodeById(folderId, folderTreeClone);
      if (itemParentFolder) {
        itemParentFolder.items = [...itemParentFolder.items, newItemNodeToAdd];
      }
    });

    return folderTreeClone;
  }

  findNodeById(id: number, root: TreeNode): TreeNode | undefined {
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
}
