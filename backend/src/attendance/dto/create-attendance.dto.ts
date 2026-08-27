import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AttendanceStatus } from "../../common/attendance-status.enum";
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from "class-validator";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export class CreateAttendanceDto {
  @ApiProperty({ format: "uuid" })
  @IsUUID()
  employeeId!: string;

  @ApiProperty({ example: "2026-08-27" })
  @Matches(datePattern, { message: "date must be in YYYY-MM-DD format" })
  date!: string;

  @ApiPropertyOptional({ example: "08:03" })
  @IsOptional()
  @Matches(timePattern, { message: "checkIn must be in HH:mm format" })
  checkIn?: string;

  @ApiPropertyOptional({ example: "17:02" })
  @IsOptional()
  @Matches(timePattern, { message: "checkOut must be in HH:mm format" })
  checkOut?: string;

  @ApiProperty({ enum: AttendanceStatus, example: AttendanceStatus.Present })
  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;

  @ApiPropertyOptional({ example: "Arrived a few minutes late" })
  @IsOptional()
  @IsString()
  note?: string;
}
