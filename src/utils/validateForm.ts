import { z } from "zod";

export const registrationSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long." })
    .max(50, { message: "Name must be less than 50 characters." }),
  email: z.string().email({ message: "Invalid email format." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .regex(/[A-Z]/, {
      message: "Password must include at least one uppercase letter.",
    }),
});

export const passwordChangeSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .regex(/[A-Z]/, {
      message: "Password must include at least one uppercase letter.",
    }),
});

export const usernameChangeSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long." })
    .max(50, { message: "Name must be less than 50 characters." }),
});

export const validateRegistration = (data: unknown) => {
  try {
    registrationSchema.parse(data);
    return null; // No errors
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map((e) => e.message).join(", ");
    }
    return "Invalid data.";
  }
};

export const validatePasswordChange = (data: unknown) => {
  try {
    passwordChangeSchema.parse(data);
    return null; // No errors
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map((e) => e.message).join(", ");
    }
    return "Invalid data.";
  }
};

export const validateUsernameChange = (data: unknown) => {
  try {
    usernameChangeSchema.parse(data);
    return null; // No errors
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map((e) => e.message).join(", ");
    }
    return "Invalid data.";
  }
};
