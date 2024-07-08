import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HttpHealthIndicator,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { DogHealthIndicator } from './health-check.service';

@Controller('health-check')
export class HealthCheckController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private dogHealthIndicator: DogHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      () => this.db.pingCheck('database'),
      () => this.dogHealthIndicator.isHealty('dog'),
    ]);
  }
}
