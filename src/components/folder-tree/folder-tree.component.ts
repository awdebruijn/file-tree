import { Component, computed, model, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { findItemNodeById, findNodeById } from '../../helpers/folder-tree.helpers';
import { TreeNode } from '../../models/schemas';

@Component({
  selector: 'app-folder-tree-component',
  templateUrl: './folder-tree.component.html',
  styleUrl: './folder-tree.component.scss',
  standalone: true,
  imports: [NgTemplateOutlet],
})
export class FolderTreeComponent {
  folderTree = model.required<TreeNode>();
  level = signal(0);
  selectedItems = computed(() => {
    return this.getAllSelectedItems(this.folderTree());
  });

  updateFolderSelectedState(id: number) {
    const folderTree = structuredClone(this.folderTree());
    const nodeToUpdate = findNodeById(id, folderTree);
    if (nodeToUpdate) {
      nodeToUpdate.selected = !nodeToUpdate.selected;
      this.updateChildNodes(nodeToUpdate, nodeToUpdate.selected, folderTree);
      this.folderTree.set(folderTree);
    }
  }

  updateChildNodes(node: TreeNode, selected: boolean, folderTree: TreeNode) {
    function traverseDown(node: TreeNode, selected: boolean) {
      if (node.children.length > 0) {
        node.children.forEach((child) => {
          child.selected = selected;
          traverseDown(child, selected);
        });
      }

      if (node.items.length > 0) {
        node.items.forEach((item) => {
          const itemToUpdate = findItemNodeById(item.id, folderTree);
          if (itemToUpdate) {
            itemToUpdate.selected = selected;
          }
        });
      }
    }

    traverseDown(node, selected);
  }

  updateItemSelectedState(id: number) {
    const folderTree = structuredClone(this.folderTree());
    const itemToUpdate = findItemNodeById(id, folderTree);
    if (itemToUpdate) {
      itemToUpdate.selected = !itemToUpdate.selected;
      this.folderTree.set(folderTree);
    }
  }

  getAllSelectedItems(root: TreeNode) {
    let selectedIds: number[] = [];

    function traverseDown(node: TreeNode) {
      if (!node) {
        return;
      }

      if (node.items.length > 0) {
        node.items.forEach((item) => {
          if (item.selected) {
            selectedIds = [...selectedIds, item.id];
          }
        });
      }

      if (node.children.length > 0) {
        node.children.forEach((child) => {
          traverseDown(child);
        });
      }

      return selectedIds;
    }

    return traverseDown(root);
  }
}
