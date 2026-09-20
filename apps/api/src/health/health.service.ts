import { Injectable } from '@nestjs/common';

import { PostgresService } from '../infra/postgres/postgres.service';
import { RedisService } from '../infra/redis/redis.service';

export type DependencyStatus = 'up' | 'down';

export interface DependencyCheck {
  status: DependencyStatus;
  latencyMs: number | null;
  error?: string;
}

export interface ReadinessResult {
  status: 'ok' | 'error';
  checks: {
    postgres: DependencyCheck;
    redis: DependencyCheck;
  };
}

@Injectable()
export class HealthService {
  constructor(
    private readonly postgres: PostgresService,
    private readonly redis: RedisService,
  ) {}

  private async checkDependency(ping: () => Promise<void>): Promise<DependencyCheck> {
    const startedAt = Date.now();
    try {
      await ping();
      return { status: 'up', latencyMs: Date.now() - startedAt };
    } catch (error) {
      return {
        status: 'down',
        latencyMs: null,
        error: error instanceof Error ? error.message : 'unknown error',
      };
    }
  }

  async checkReadiness(): Promise<ReadinessResult> {
    const [postgres, redis] = await Promise.all([
      this.checkDependency(() => this.postgres.ping()),
      this.checkDependency(() => this.redis.ping()),
    ]);

    const status = postgres.status === 'up' && redis.status === 'up' ? 'ok' : 'error';

    return { status, checks: { postgres, redis } };
  }
}
