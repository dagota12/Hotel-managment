import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export class CreateShiftDto {
  @ApiProperty({ example: "Morning" })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: "08:00" })
  @Matches(timePattern, { message: "startTime must be in HH:mm format" })
  startTime!: string;

  @ApiProperty({ example: "16:00" })
  @Matches(timePattern, { message: "endTime must be in HH:mm format" })
  endTime!: string;
}
