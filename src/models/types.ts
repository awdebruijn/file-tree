type ItemNode = {
  id: number;
  name: string;
};

type TreeNode = {
  id: number;
  name: string;
  children: TreeNode[];
  items: ItemNode[];
};
