import { Module } from '@nestjs/common';
import { MonitorController } from './monitor.controller';
import { MonitorService } from './monitor.service';
import {MongoModule} from "@core/database";

@Module({
  imports: [MongoModule],
  controllers: [MonitorController],
  providers: [MonitorService],
})
export class MonitorModule {}
