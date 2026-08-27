import { Controller, Get, Query } from "@nestjs/common";
import { ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ReportsService } from "./reports.service";

@ApiTags("reports")
@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("attendance")
  @ApiQuery({ name: "from", required: true, example: "2026-08-01" })
  @ApiQuery({ name: "to", required: true, example: "2026-08-27" })
  @ApiOkResponse({ description: "Attendance statistics by employee" })
  attendance(@Query("from") from?: string, @Query("to") to?: string) {
    return this.reportsService.attendanceReport(from, to);
  }

  @Get("department-attendance")
  @ApiQuery({ name: "from", required: true, example: "2026-08-01" })
  @ApiQuery({ name: "to", required: true, example: "2026-08-27" })
  @ApiOkResponse({ description: "Attendance statistics by department" })
  departmentAttendance(@Query("from") from?: string, @Query("to") to?: string) {
    return this.reportsService.departmentAttendanceReport(from, to);
  }
}
