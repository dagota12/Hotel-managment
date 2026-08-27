import { ApiPropertyOptional } from "@nestjs/swagger";
import { AttendanceStatus } from "../../common/attendance-status.enum";
import { IsEnum, IsOptional, IsString, Matches } from "class-validator";

const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export class UpdateAttendanceDto {
  @ApiPropertyOptional({ example: "09:00" })
  @IsOptional()
  @Matches(timePattern, { message: "checkIn must be in HH:mm format" })
  checkIn?: string;

  @ApiPropertyOptional({ example: "17:00" })
  @IsOptional()
  @Matches(timePattern, { message: "checkOut must be in HH:mm format" })
  checkOut?: string;

  @ApiPropertyOptional({ enum: AttendanceStatus })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}
