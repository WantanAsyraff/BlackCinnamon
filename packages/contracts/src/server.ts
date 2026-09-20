/**
 * Normalized Minecraft server data contract.
 *
 * These shapes are owned by NestJS and derived from the raw RestApi plugin
 * response. The frontend must never depend on the raw plugin schema.
 */

export interface ServerPlayerCount {
  online: number;
  max: number;
}

export interface ServerStatus {
  serverId: string;
  online: boolean;
  players: ServerPlayerCount;
  version: string | null;
  motd: string | null;
  /** ISO-8601 timestamp of the last successful refresh. */
  updatedAt: string | null;
  /** True when the cached value could not be refreshed recently. */
  stale: boolean;
}

export interface OnlinePlayer {
  username: string;
}

export interface OnlinePlayers {
  players: OnlinePlayer[];
  updatedAt: string | null;
  stale: boolean;
}

export const SERVER_EVENT_NAMES = {
  status: 'server.status',
  playerCount: 'server.player-count',
} as const;

export type ServerEventName = (typeof SERVER_EVENT_NAMES)[keyof typeof SERVER_EVENT_NAMES];

export interface ServerStatusEvent {
  event: typeof SERVER_EVENT_NAMES.status;
  data: ServerStatus;
}

export interface ServerPlayerCountEvent {
  event: typeof SERVER_EVENT_NAMES.playerCount;
  data: ServerPlayerCount;
}

export type ServerEvent = ServerStatusEvent | ServerPlayerCountEvent;
