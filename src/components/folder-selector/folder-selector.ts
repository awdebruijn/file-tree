import { Component, inject, viewChild } from '@angular/core';
import { FolderTreeComponent } from '../folder-tree/folder-tree.component';
import { FolderData, TreeNode } from '../../models/schemas';
import { WareHouseService } from '../../services/ware-house.service';
import { catchError, filter, map, Observable } from 'rxjs';
import { itemFiller, treeNodeBuilder } from '../../helpers/folder-tree.helpers';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-folder-selector',
  imports: [FolderTreeComponent, AsyncPipe],
  templateUrl: './folder-selector.html',
  styleUrl: './folder-selector.scss',
})
export class FolderSelector {
  wareHouseService = inject(WareHouseService);
  folderTree$!: Observable<TreeNode>;

  folderTreeComponent = viewChild<FolderTreeComponent>('folderTreeComponent');

  constructor() {
    this.folderTree$ = this.wareHouseService.getFolderData().pipe(
      map((data: FolderData) => itemFiller(data, treeNodeBuilder(data))),
      filter((data) => data !== null),
      catchError(() => {
        throw 'An error occurred while fetching folder structure';
      }),
    );
  }

  clearSelection() {
    this.folderTreeComponent()?.clearSelection();
  }
}
