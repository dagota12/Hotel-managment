import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AttendanceQueryDto } from "./dto/attendance-query.dto";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
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

  @Post()
  @ApiCreatedResponse({ description: "Create attendance record" })
  create(@Body() dto: CreateAttendanceDto) {
    return this.attendanceService.create(dto);
  }
}
