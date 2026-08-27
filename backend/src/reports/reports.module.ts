import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AttendanceRecord } from "../attendance/attendance-record.entity";
import { Employee } from "../employees/employee.entity";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";

@Module({
  imports: [TypeOrmModule.forFeature([Employee, AttendanceRecord])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
