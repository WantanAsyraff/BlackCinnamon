import { Module } from '@nestjs/common';

import { HealthModule } from './health/health.module';
import { PostgresModule } from './infra/postgres/postgres.module';
import { RedisModule } from './infra/redis/redis.module';

@Module({
  imports: [PostgresModule, RedisModule, HealthModule],
})
export class AppModule {}
