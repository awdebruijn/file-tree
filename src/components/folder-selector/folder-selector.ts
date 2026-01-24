import { Component, input, viewChild } from '@angular/core';
import { FolderTreeComponent } from '../folder-tree/folder-tree.component';
import { TreeNode } from '../../models/schemas';

@Component({
  selector: 'app-folder-selector',
  imports: [FolderTreeComponent],
  templateUrl: './folder-selector.html',
  styleUrl: './folder-selector.scss',
})
export class FolderSelector {
  folderTree = input<TreeNode>();

  folderTreeComponent = viewChild<FolderTreeComponent>('folderTreeComponent');

  clearSelection() {
    this.folderTreeComponent()?.clearSelection();
  }
}
