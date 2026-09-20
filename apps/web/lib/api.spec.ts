import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchApiHealth, getApiBaseUrl } from './api';

describe('fetchApiHealth', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reports healthy when the API responds', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ status: 'ok' }),
      }),
    );

    await expect(fetchApiHealth()).resolves.toEqual({
      reachable: true,
      status: 'ok',
      error: null,
    });
  });

  it('reports unreachable when fetch rejects', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNREFUSED')));

    const result = await fetchApiHealth();
    expect(result.reachable).toBe(false);
    expect(result.error).toContain('ECONNREFUSED');
  });

  it('reports an error for non-2xx responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));

    await expect(fetchApiHealth()).resolves.toEqual({
      reachable: false,
      status: null,
      error: 'HTTP 503',
    });
  });

  it('defaults the API base URL', () => {
    expect(getApiBaseUrl()).toBe('http://localhost:3001');
  });
});
