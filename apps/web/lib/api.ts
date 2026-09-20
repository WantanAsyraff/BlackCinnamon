export interface ApiHealth {
  reachable: boolean;
  status: string | null;
  error: string | null;
}

export function getApiBaseUrl(): string {
  return (
    process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001'
  );
}

/**
 * Checks whether the application API is reachable. Never throws: the website
 * must keep rendering even when the API or Minecraft data source is down.
 */
export async function fetchApiHealth(timeoutMs = 2000): Promise<ApiHealth> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/health`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
      return { reachable: false, status: null, error: `HTTP ${response.status}` };
    }

    const body = (await response.json()) as { status?: string };
    return { reachable: true, status: body.status ?? null, error: null };
  } catch (error) {
    return {
      reachable: false,
      status: null,
      error: error instanceof Error ? error.message : 'unknown error',
    };
  }
}
