import * as z from 'zod';

const FileTreeSchema = z.object({
  folders: z.object({
    columns: z.tuple([z.string(), z.string(), z.string()]),
    data: z.array(z.tuple([z.number(), z.string(), z.union([z.number(), z.null()])])),
  }),
  items: z.object({
    columns: z.tuple([z.string(), z.string(), z.string()]),
    data: z.array(z.tuple([z.number(), z.string(), z.number()])),
  }),
});

export { FileTreeSchema };
export type FileTree = z.infer<typeof FileTreeSchema>;
