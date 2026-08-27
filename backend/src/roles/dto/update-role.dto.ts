import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";

export class UpdateRoleDto {
  @ApiPropertyOptional({ example: "Receptionist" })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;
}
