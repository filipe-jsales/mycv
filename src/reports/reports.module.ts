import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { Report } from './report.entity';
import { ReportsService } from './reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Report])], //creates the repository ,
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
