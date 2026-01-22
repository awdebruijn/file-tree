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
    const rootFolders: TreeNode[] = tree.folders.data
      .filter((folder) => folder[2] === null)
      .map((folder) => {
        const node: TreeNode = { id: folder[0], name: folder[1], children: [] };
        return node;
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    const rootFoldersIdMap = rootFolders.reduce(
      (acc: { [key: number]: number }, el: TreeNode, i) => {
        acc[el.id] = i;
        return acc;
      },
      {},
    );

    console.log('Root folders"', rootFolders, rootFoldersIdMap);

    const folders: TreeNode[] = [];
    tree.folders.data.forEach((folder) => {
      if (folder[2] !== null) {
        const newNode: TreeNode = { id: folder[0], name: folder[1], children: [] };

        const rootFolderId = rootFoldersIdMap[folder[2]];
        if (rootFolderId) {
          rootFolders.find((folder) => folder.id === rootFolderId)?.children.push(newNode);
          return;
        }
      }
    });
  }
}
