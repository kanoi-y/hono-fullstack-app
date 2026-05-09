import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
