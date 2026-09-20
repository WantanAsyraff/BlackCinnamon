import { HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Response } from 'express';

import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;
  const checkReadiness = jest.fn();

  beforeEach(async () => {
    checkReadiness.mockReset();

    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: HealthService, useValue: { checkReadiness } }],
    }).compile();

    controller = moduleRef.get(HealthController);
  });

  it('reports liveness', () => {
    const result = controller.liveness();
    expect(result.status).toBe('ok');
    expect(result.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });

  it('returns 200 when all dependencies are up', async () => {
    checkReadiness.mockResolvedValue({
      status: 'ok',
      checks: {
        postgres: { status: 'up', latencyMs: 1 },
        redis: { status: 'up', latencyMs: 1 },
      },
    });

    const status = jest.fn();
    const response = { status } as unknown as Response;

    await controller.readiness(response);

    expect(status).toHaveBeenCalledWith(HttpStatus.OK);
  });

  it('returns 503 when a dependency is down', async () => {
    checkReadiness.mockResolvedValue({
      status: 'error',
      checks: {
        postgres: { status: 'down', latencyMs: null, error: 'refused' },
        redis: { status: 'up', latencyMs: 1 },
      },
    });

    const status = jest.fn();
    const response = { status } as unknown as Response;

    await controller.readiness(response);

    expect(status).toHaveBeenCalledWith(HttpStatus.SERVICE_UNAVAILABLE);
  });
});
