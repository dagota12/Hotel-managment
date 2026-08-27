import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Matches } from "class-validator";

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export class UpdateShiftDto {
  @ApiPropertyOptional({ example: "Morning" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: "08:00" })
  @IsOptional()
  @Matches(timePattern, { message: "startTime must be in HH:mm format" })
  startTime?: string;

  @ApiPropertyOptional({ example: "16:00" })
  @IsOptional()
  @Matches(timePattern, { message: "endTime must be in HH:mm format" })
  endTime?: string;
}
