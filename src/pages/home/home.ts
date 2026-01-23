import { Component, inject } from '@angular/core';
import { FolderTreeComponent } from '../../components/folder-tree/folder-tree.component';
import { WareHouseService } from '../../services/ware-house.service';
import { FolderData } from '../../schemas/schemas';

type TreeNode = {
  id: number;
  name: string;
  children: TreeNode[];
};

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
      next: (data: any) => {
        console.log('Folder Structure:', data);
        this.treeNodeBuilder(data);
      },
      error: (error: any) => {
        console.error('Error fetching folder structure:', error);
      },
    });
  }

  treeNodeBuilder(folderData: FolderData) {
    const foldersData = folderData.folders.data;
    const folderTree: TreeNode = { id: 0, name: 'root', children: [] };

    foldersData.forEach((currentFolderData) => {
      // If folder has no parent, add to root node's children
      const parentId = currentFolderData[2];
      const newFolderNodeToAdd: TreeNode = {
        id: currentFolderData[0],
        name: currentFolderData[1],
        children: [],
      };

      if (parentId === null) {
        folderTree.children.push(newFolderNodeToAdd);
        return;
      }

      // NOTE: The order of the array makes sure when the next item in folderData is handled, its parent already exist,
      // so there is no need to handle the case if it doesn't.

      // Find parent folder and add the folder to its children
      const existingFolder = this.findNodeById(parentId, folderTree);
      if (existingFolder) {
        existingFolder.children.push(newFolderNodeToAdd);
        return;
      }
    });

    console.log('Folder tree:', folderTree);
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
