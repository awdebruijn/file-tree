import { Component, computed, model } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { findItemNodeById, findNodeById, setNodeStates } from '../../helpers/folder-tree.helpers';
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
  selectedItems = computed(() => {
    return this.getAllSelectedItems(this.folderTree());
  });

  uiFolderTree = computed(() => {
    const folderTree = this.folderTree();
    console.log(JSON.stringify(this.updateFolderCheckBoxStates(folderTree), null, 2));
    return this.updateFolderCheckBoxStates(folderTree);
  });

  updateFolderSelectedState(id: number) {
    const folderTree = structuredClone(this.uiFolderTree());
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
    const folderTree = structuredClone(this.uiFolderTree());
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

  updateFolderCheckBoxStates(root: TreeNode) {
    const rootCopy = structuredClone(root);
    function traverseTree(node: TreeNode) {
      if (node.items.length > 0) {
        setNodeStates(node);
      }

      if (node.children.length > 0) {
        node.children.forEach((child) => {
          traverseTree(child);
        });
      }

      return node;
    }
    return traverseTree(rootCopy);
  }
}
