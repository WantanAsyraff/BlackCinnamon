import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';

import { getEnv } from '../../config/env';

@Injectable()
export class PostgresService implements OnModuleDestroy {
  private readonly logger = new Logger(PostgresService.name);
  private pool: Pool | null = null;

  private getPool(): Pool {
    if (this.pool === null) {
      this.pool = new Pool({
        connectionString: getEnv().DATABASE_URL,
        max: 10,
        connectionTimeoutMillis: 3000,
      });

      this.pool.on('error', (error) => {
        this.logger.error(`Idle PostgreSQL client error: ${error.message}`);
      });
    }
    return this.pool;
  }

  async ping(): Promise<void> {
    await this.getPool().query('SELECT 1');
  }

  async onModuleDestroy(): Promise<void> {
    if (this.pool !== null) {
      await this.pool.end();
      this.pool = null;
    }
  }
}
