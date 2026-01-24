import { Component, inject } from '@angular/core';
import { WareHouseService } from '../../services/ware-house.service';
import { FolderData, TreeNode } from '../../models/schemas';
import { itemFiller, treeNodeBuilder } from '../../helpers/folder-tree.helpers';
import { catchError, filter, map, Observable } from 'rxjs';
import { FolderSelector } from '../../components/folder-selector/folder-selector';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [FolderSelector, AsyncPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true,
})
export class Home {
  wareHouseService = inject(WareHouseService);
  folderTree$!: Observable<TreeNode>;

  constructor() {
    this.folderTree$ = this.wareHouseService.getFolderData().pipe(
      map((data: FolderData) => itemFiller(data, treeNodeBuilder(data))),
      filter((data) => data !== null),
      catchError((err) => {
        throw 'An error occurred while fetching folder data' + JSON.stringify(err);
      }),
    );
  }
}
