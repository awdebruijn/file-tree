import { Component, inject } from '@angular/core';
import { FolderTreeComponent } from '../../components/folder-tree/folder-tree.component';
import { WareHouseService } from '../../services/ware-house.service';
import { FolderData } from '../../models/schemas';
import { itemFiller, treeNodeBuilder } from '../../helpers/folder-tree.helpers';

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
        const folderTree = treeNodeBuilder(data);
        console.log(itemFiller(data, folderTree));
      },
      error: (error: any) => {
        console.error('Error fetching folder structure:', error);
      },
    });
  }
}
