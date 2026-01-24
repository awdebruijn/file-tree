import {
  findNodeById,
  itemFiller,
  sortItemNodesByName,
  sortTreeNodesByName,
  treeNodeBuilder,
} from './folder-tree.helpers';
import { describe, expect, it } from 'vitest';
import { FolderData, TreeNode } from '../models/schemas';

describe('folder-tree helpers', () => {
  it('treeNodeBuilder builds a nested tree and sorts siblings by name', () => {
    const folderData: FolderData = {
      folders: {
        columns: ['id', 'title', 'parent_id'],
        data: [
          [1, 'Alpha', null],
          [2, 'Bravo', 1],
          [4, 'Delta', 2],
          [3, 'Zulu', null],
        ],
      },
      items: {
        columns: ['id', 'title', 'folder_id'],
        data: [],
      },
    };

    const tree = treeNodeBuilder(folderData);

    // root should have two children (Alpha and Zulu) sorted alphabetically
    expect(tree.children.length).toBe(2);
    expect(tree.children.map((c: TreeNode) => c.name)).toEqual(['Alpha', 'Zulu']);

    // Alpha should have child Bravo, which has child Delta
    const alpha = findNodeById(1, tree);
    expect(alpha).toBeDefined();
    expect(alpha!.children.length).toBe(1);
    expect(alpha!.children[0].name).toBe('Bravo');

    const bravo = findNodeById(2, tree);
    expect(bravo).toBeDefined();
    expect(bravo!.children.length).toBe(1);
    expect(bravo!.children[0].name).toBe('Delta');

    // non-existing id returns undefined
    expect(findNodeById(999, tree)).toBeUndefined();
  });

  it('sortTreeNodesByName sorts nodes by name', () => {
    const children = [
      { id: 1, name: 'Charlie', children: [], items: [], selected: false, indeterminate: false },
      { id: 2, name: 'Alpha', children: [], items: [], selected: false, indeterminate: false },
      { id: 3, name: 'Bravo', children: [], items: [], selected: false, indeterminate: false },
    ] as TreeNode[];

    const sorted = sortTreeNodesByName(children);
    expect(sorted.map((c) => c.name)).toEqual(['Alpha', 'Bravo', 'Charlie']);

    // original array should not be mutated (function copies)
    expect(children.map((c) => c.name)).toEqual(['Charlie', 'Alpha', 'Bravo']);
  });

  it('sortItemNodesByName sorts items by name', () => {
    const items = [
      { id: 10, name: 'zeta' },
      { id: 11, name: 'alpha' },
      { id: 12, name: 'beta' },
    ];

    const sorted = sortItemNodesByName(items as any);
    expect(sorted.map((i) => i.name)).toEqual(['alpha', 'beta', 'zeta']);

    // original items array remains unchanged
    expect(items.map((i) => i.name)).toEqual(['zeta', 'alpha', 'beta']);
  });

  it('itemFiller places items into correct folders, sorts items, and does not mutate original tree', () => {
    const folderData = {
      folders: {
        data: [
          [1, 'RootFolder', null],
          [2, 'ChildFolder', 1],
        ],
      },
      items: {
        data: [
          [100, 'Banana', 2],
          [101, 'Apple', 2],
          [102, 'Solo', 1],
        ],
      },
    } as any;

    const baseTree = treeNodeBuilder(folderData);

    // baseTree should initially have no items in folders
    const childBefore = findNodeById(2, baseTree)!;
    expect(childBefore.items).toEqual([]);

    const filled = itemFiller(folderData, baseTree);

    // filled tree should have items placed and sorted in folder 2
    const child = findNodeById(2, filled)!;
    expect(child.items.map((i) => i.name)).toEqual(['Apple', 'Banana']);

    // root should also have its item
    const root = findNodeById(1, filled)!;
    expect(root.items.map((i) => i.name)).toEqual(['Solo']);

    // original tree should remain without items (itemFiller clones)
    const childAfterOriginal = findNodeById(2, baseTree)!;
    expect(childAfterOriginal.items).toEqual([]);
    const rootAfterOriginal = findNodeById(1, baseTree)!;
    expect(rootAfterOriginal.items).toEqual([]);
  });
});
