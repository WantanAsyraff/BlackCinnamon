import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

import { getEnv } from '../../config/env';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;

  private getClient(): Redis {
    if (this.client === null) {
      this.client = new Redis(getEnv().REDIS_URL, {
        lazyConnect: false,
        maxRetriesPerRequest: 2,
        connectTimeout: 3000,
      });

      this.client.on('error', (error) => {
        this.logger.error(`Redis client error: ${error.message}`);
      });
    }
    return this.client;
  }

  async ping(): Promise<void> {
    await this.getClient().ping();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client !== null) {
      await this.client.quit();
      this.client = null;
    }
  }
}
