import { z } from 'zod';

/**
 * Minecraft username rules (Java Edition): 3-16 characters, letters, digits
 * and underscores only.
 */
export const minecraftUsernameSchema = z
  .string()
  .min(3)
  .max(16)
  .regex(/^[A-Za-z0-9_]+$/, 'Invalid Minecraft username');

export const resolvePlayerSchema = z.object({
  username: minecraftUsernameSchema,
});

export const checkoutRequestSchema = z.object({
  productSlug: z.string().min(1),
  minecraftUsername: minecraftUsernameSchema,
  email: z.string().email(),
  phone: z.string().min(6).max(20).optional(),
});

export const orderPublicIdSchema = z.string().min(6).max(64);

export type ResolvePlayerInput = z.infer<typeof resolvePlayerSchema>;
export type CheckoutRequestInput = z.infer<typeof checkoutRequestSchema>;
