import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateDepartmentDto {
  @ApiProperty({ example: "Reception" })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name!: string;
}
