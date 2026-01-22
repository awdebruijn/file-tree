import * as z from 'zod';

const FolderSchema = z.tuple([z.number(), z.string(), z.union([z.number(), z.null()])]);
const ItemSchema = z.tuple([z.number(), z.string(), z.number()]);

const FolderTreeSchema = z.object({
  folders: z.object({
    columns: z.tuple([z.string(), z.string(), z.string()]),
    data: z.array(FolderSchema),
  }),
  items: z.object({
    columns: z.tuple([z.string(), z.string(), z.string()]),
    data: z.array(ItemSchema),
  }),
});

export type FolderTree = z.infer<typeof FolderTreeSchema>;
export type Folder = z.infer<typeof FolderSchema>;
export type Item = z.infer<typeof ItemSchema>;
export { FolderTreeSchema, FolderSchema, ItemSchema };
