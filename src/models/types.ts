export type ItemNode = {
  id: number;
  name: string;
};

export type TreeNode = {
  id: number;
  name: string;
  children: TreeNode[];
  items: ItemNode[];
};
