import { Component, input } from '@angular/core';
import { TreeNode } from '../../models/types';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-folder-tree-component',
  templateUrl: './folder-tree.component.html',
  styleUrl: './folder-tree.component.scss',
  standalone: true,
  imports: [NgTemplateOutlet],
})
export class FolderTreeComponent {
  folderTree = input<TreeNode | null>();
}
