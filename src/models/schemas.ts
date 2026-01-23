import * as z from 'zod';

const FolderSchema = z.tuple([z.number(), z.string(), z.union([z.number(), z.null()])]);
const ItemSchema = z.tuple([z.number(), z.string(), z.number()]);

const FolderDataSchema = z.object({
  folders: z.object({
    columns: z.tuple([z.string(), z.string(), z.string()]),
    data: z.array(FolderSchema),
  }),
  items: z.object({
    columns: z.tuple([z.string(), z.string(), z.string()]),
    data: z.array(ItemSchema),
  }),
});

export type FolderData = z.infer<typeof FolderDataSchema>;
export type Folder = z.infer<typeof FolderSchema>;
export type Item = z.infer<typeof ItemSchema>;

export { FolderDataSchema, FolderSchema, ItemSchema };
