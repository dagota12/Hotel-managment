import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from "class-validator";

export class CreateEmployeeDto {
  @ApiProperty({ example: "John Doe" })
  @IsString()
  @IsNotEmpty()
  @Length(2, 120)
  fullName!: string;

  @ApiProperty({ example: "john@example.com" })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: "+1 555 0100" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ format: "uuid" })
  @IsUUID()
  departmentId!: string;

  @ApiProperty({ format: "uuid" })
  @IsUUID()
  roleId!: string;

  @ApiProperty({ format: "uuid" })
  @IsUUID()
  shiftId!: string;
}
