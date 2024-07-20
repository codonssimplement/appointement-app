import { Module } from '@nestjs/common';
import { TaksController } from './taks.controller';
import { TaksService } from './taks.service';

@Module({
  controllers: [TaksController],
  providers: [TaksService]
})
export class TaksModule {}
