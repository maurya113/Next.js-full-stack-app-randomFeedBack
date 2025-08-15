import * as z from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username must be atleast 2 charcters")
  .max(20, "username should not exceed 20 charcters")
  .regex(/^[a-zA-Z0-9_]+$/, "username must not contain special character");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z
    .string()
    .trim()
    .pipe(z.email({ message: "invalid email address" })),
  password: z
    .string()
    .min(6, { message: "password must be minimun 6 characters" }),
});
