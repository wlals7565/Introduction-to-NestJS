import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './Task.service';
import { BatchController } from './batch.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [TaskService],
  controllers: [BatchController],
})
export class BatchModule {}
