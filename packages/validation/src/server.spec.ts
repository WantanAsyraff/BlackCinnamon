import { describe, expect, it } from 'vitest';

import { serverStatusSchema } from './server';

const validStatus = {
  serverId: 'survival-01',
  online: true,
  players: { online: 842, max: 2500 },
  version: '1.21.x',
  motd: 'BlackCinnamon',
  updatedAt: '2026-09-20T08:00:00.000Z',
  stale: false,
};

describe('serverStatusSchema', () => {
  it('accepts a well-formed status', () => {
    expect(serverStatusSchema.safeParse(validStatus).success).toBe(true);
  });

  it('rejects a negative player count', () => {
    const invalid = { ...validStatus, players: { online: -1, max: 2500 } };
    expect(serverStatusSchema.safeParse(invalid).success).toBe(false);
  });

  it('rejects a missing server id', () => {
    const { serverId: _serverId, ...invalid } = validStatus;
    expect(serverStatusSchema.safeParse(invalid).success).toBe(false);
  });

  it('rejects an invalid timestamp', () => {
    const invalid = { ...validStatus, updatedAt: 'yesterday' };
    expect(serverStatusSchema.safeParse(invalid).success).toBe(false);
  });
});
