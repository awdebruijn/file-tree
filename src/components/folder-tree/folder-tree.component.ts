import { Component, input } from '@angular/core';
import { TreeNode } from '../../models/types';

@Component({
  selector: 'app-folder-tree-component',
  templateUrl: './folder-tree.component.html',
  styleUrl: './folder-tree.component.scss',
  standalone: true,
})
export class FolderTreeComponent {
  folderTree = input<TreeNode>();
}
