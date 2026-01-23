import { Component, inject } from '@angular/core';
import { FolderTreeComponent } from '../../components/folder-tree/folder-tree.component';
import { WareHouseService } from '../../services/ware-house.service';
import { FolderData } from '../../models/schemas';
import { itemFiller, treeNodeBuilder } from '../../helpers/folder-tree.helpers';
import { TreeNode } from '../../models/types';
import { catchError, map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [FolderTreeComponent, AsyncPipe],
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
      catchError((err) => {
        throw 'An error occurred while fetching folder data' + JSON.stringify(err);
      }),
    );
  }
}
