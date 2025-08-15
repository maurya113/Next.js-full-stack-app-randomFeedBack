import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "content must be atleast of 10 characters")
    .max(200, "must not exceed 200 characters"),
});
