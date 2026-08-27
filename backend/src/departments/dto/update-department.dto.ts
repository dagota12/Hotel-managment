import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";

export class UpdateDepartmentDto {
  @ApiPropertyOptional({ example: "Reception" })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;
}
