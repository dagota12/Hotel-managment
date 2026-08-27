import { ApiPropertyOptional } from "@nestjs/swagger";
import { AttendanceStatus } from "../../common/attendance-status.enum";
import { IsEnum, IsOptional, IsUUID, Matches } from "class-validator";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export class AttendanceQueryDto {
  @ApiPropertyOptional({ format: "uuid" })
  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @ApiPropertyOptional({ example: "2026-08-01" })
  @IsOptional()
  @Matches(datePattern, { message: "from must be in YYYY-MM-DD format" })
  from?: string;

  @ApiPropertyOptional({ example: "2026-08-27" })
  @IsOptional()
  @Matches(datePattern, { message: "to must be in YYYY-MM-DD format" })
  to?: string;

  @ApiPropertyOptional({ enum: AttendanceStatus })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;
}
