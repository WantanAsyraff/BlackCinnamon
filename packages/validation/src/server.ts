import { z } from 'zod';

export const serverPlayerCountSchema = z.object({
  online: z.number().int().nonnegative(),
  max: z.number().int().nonnegative(),
});

export const serverStatusSchema = z.object({
  serverId: z.string().min(1),
  online: z.boolean(),
  players: serverPlayerCountSchema,
  version: z.string().nullable(),
  motd: z.string().nullable(),
  updatedAt: z.string().datetime().nullable(),
  stale: z.boolean(),
});

export const onlinePlayerSchema = z.object({
  username: z.string().min(1).max(16),
});

export const onlinePlayersSchema = z.object({
  players: z.array(onlinePlayerSchema),
  updatedAt: z.string().datetime().nullable(),
  stale: z.boolean(),
});

export type ServerStatusInput = z.infer<typeof serverStatusSchema>;
export type OnlinePlayersInput = z.infer<typeof onlinePlayersSchema>;
