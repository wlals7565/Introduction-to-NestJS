import { Controller, Post } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Controller('batch')
export class BatchController {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  @Post('/start-cron')
  start() {
    const job = this.schedulerRegistry.getCronJob('cronJob');

    job.start();
    console.log(`start!  ${job.lastDate()}`);
  }

  @Post('/stop-cron')
  stop() {
    const job = this.schedulerRegistry.getCronJob('cronJob');

    job.stop();
    console.log(`stopped! ${job.lastDate()}`);
  }
}
