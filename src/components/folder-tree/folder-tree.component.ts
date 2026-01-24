import { Component, computed, model } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { findNodeById } from '../../helpers/folder-tree.helpers';
import { TreeNode } from '../../models/schemas';
import {
  findItemNodeById,
  getAllSelectedItems,
  updateAllChildNodes,
  updateFolderCheckBoxStates,
} from './folder-tree.component.helpers';

@Component({
  selector: 'app-folder-tree-component',
  templateUrl: './folder-tree.component.html',
  styleUrl: './folder-tree.component.scss',
  standalone: true,
  imports: [NgTemplateOutlet],
})
export class FolderTreeComponent {
  folderTree = model.required<TreeNode>();
  selectedItems = computed(() => {
    return getAllSelectedItems(this.folderTree());
  });

  uiFolderTree = computed(() => {
    const folderTree = this.folderTree();
    return updateFolderCheckBoxStates(folderTree);
  });

  updateFolderSelectedState(id: number) {
    // clone current UI state first
    const folderTree = structuredClone(this.uiFolderTree());
    const nodeToUpdate = findNodeById(id, folderTree);

    if (nodeToUpdate) {
      nodeToUpdate.selected = !nodeToUpdate.selected;
      updateAllChildNodes(nodeToUpdate, nodeToUpdate.selected, folderTree);
      // set original folderTree to updated UI state
      this.folderTree.set(folderTree);
    }
  }

  clearSelection() {
    // clone current UI state first
    const folderTree = structuredClone(this.uiFolderTree());
    const nodeToUpdate = findNodeById(0, folderTree);

    if (nodeToUpdate) {
      updateAllChildNodes(nodeToUpdate, false, folderTree);
      // set original folderTree to updated UI state
      this.folderTree.set(folderTree);
    }
  }

  updateItemSelectedState(id: number) {
    const folderTree = structuredClone(this.uiFolderTree());
    const itemToUpdate = findItemNodeById(id, folderTree);
    if (itemToUpdate) {
      itemToUpdate.selected = !itemToUpdate.selected;
      this.folderTree.set(folderTree);
    }
  }
}
