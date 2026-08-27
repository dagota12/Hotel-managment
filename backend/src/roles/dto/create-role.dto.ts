import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateRoleDto {
  @ApiProperty({ example: "Receptionist" })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name!: string;
}
