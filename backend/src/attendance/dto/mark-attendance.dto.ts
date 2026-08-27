import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class MarkAttendanceDto {
  @ApiProperty({ format: "uuid" })
  @IsUUID()
  employeeId!: string;
}
