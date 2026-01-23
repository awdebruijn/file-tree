import { Component, effect, input, signal } from '@angular/core';
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
  folderTree = input.required<TreeNode>();

  selectedItemIds = signal<number[]>([]);
  selectedFolderIds = signal<number[]>([]);

  constructor() {
    effect(() => console.log('selected folder ids:', this.selectedFolderIds()));
    effect(() => console.log('selected item ids:', this.selectedItemIds()));
  }

  isIndeterminate(children: TreeNode[]) {
    const childrenIds = children.map((child) => child.id);
    const someSelected = this.selectedItemIds().some((itemId) =>
      childrenIds.find((id) => id === itemId),
    );

    const allSelected = this.selectedItemIds().every((itemId) =>
      childrenIds.find((id) => id === itemId),
    );

    return allSelected ? false : someSelected;
  }

  toggleFolderSelected(id: number) {
    const selectedIds = this.selectedFolderIds();
    if (selectedIds.some((selectedId) => selectedId === id)) {
      const filtered = selectedIds.filter((selectedId) => selectedId !== id);
      this.selectedFolderIds.set(filtered);
      return;
    }

    this.selectedFolderIds.update((ids) => [...ids, id]);
  }

  toggleItemSelected(id: number) {
    const selectedItemIds = this.selectedItemIds();
    if (selectedItemIds.some((selectedId) => selectedId === id)) {
      const filtered = selectedItemIds.filter((selectedId) => selectedId !== id);
      this.selectedItemIds.set(filtered);
      return;
    }

    this.selectedItemIds.update((ids) => [...ids, id]);
  }
}
