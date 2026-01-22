import { Component, inject } from '@angular/core';
import { FolderTreeComponent } from '../../components/folder-tree/folder-tree.component';
import { WareHouseService } from '../../services/ware-house.service';
import { FolderTree } from '../../schemas/schemas';

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
        this.structureBuilder(data);
      },
      error: (error: any) => {
        console.error('Error fetching folder structure:', error);
      },
    });
  }

  structureBuilder(tree: FolderTree) {
    const folderData = tree.folders.data;
    const folderTree: TreeNode = { id: 0, name: 'root', children: [] };

    folderData.forEach((folder) => {
      // add to root children if parent is null
      if (folder[2] === null) {
        folderTree.children.push({ id: folder[0], name: folder[1], children: [] });
      }

      const parentId = folder[2];
      if (!parentId) {
        return;
      }

      // otherwise find parent folder and add folder to its children
      // first check if parentFolder already exists in folderTree, if so add node to its children
      const existing = this.findNode(parentId, folderTree);
      if (existing) {
        existing.children.push({ id: folder[0], name: folder[1], children: [] });
        return;
      }

      // else add parent to the folderTree
      const parentFolder = folderData.find((f) => f[0] === parentId);
      if (parentFolder) {
        const newParentNode: TreeNode = {
          id: parentFolder[0],
          name: parentFolder[1],
          children: [],
        };
        newParentNode.children.push({ id: folder[0], name: folder[1], children: [] });
      }
    });

    console.log('Folder tree:', folderTree);
  }

  findNode(id: number, root: TreeNode): TreeNode | undefined {
    function traverse(node: TreeNode): any {
      if (node.id === id) return node;
      for (const child of node.children) {
        const result = traverse(child);
        if (result) return result;
      }
    }
    return traverse(root);
  }
}
