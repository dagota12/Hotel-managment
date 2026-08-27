import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AttendanceQueryDto } from "./dto/attendance-query.dto";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { MarkAttendanceDto } from "./dto/mark-attendance.dto";
import { AttendanceService } from "./attendance.service";

@ApiTags("attendance")
@Controller("attendance")
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @ApiOkResponse({ description: "List attendance records" })
  findAll(@Query() query: AttendanceQueryDto) {
    return this.attendanceService.findAll(query);
  }

  @Get("today")
  @ApiOkResponse({ description: "List today's attendance by employee" })
  findToday() {
    return this.attendanceService.findToday();
  }

  @Post("check-in")
  @ApiCreatedResponse({ description: "Check an employee in for today" })
  checkIn(@Body() dto: MarkAttendanceDto) {
    return this.attendanceService.checkIn(dto.employeeId);
  }

  @Post("check-out")
  @ApiCreatedResponse({ description: "Check an employee out for today" })
  checkOut(@Body() dto: MarkAttendanceDto) {
    return this.attendanceService.checkOut(dto.employeeId);
  }

  @Post()
  @ApiCreatedResponse({ description: "Create attendance record" })
  create(@Body() dto: CreateAttendanceDto) {
    return this.attendanceService.create(dto);
  }
}
