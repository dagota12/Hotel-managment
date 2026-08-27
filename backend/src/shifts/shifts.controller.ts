import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreateShiftDto } from "./dto/create-shift.dto";
import { UpdateShiftDto } from "./dto/update-shift.dto";
import { ShiftsService } from "./shifts.service";

@ApiTags("shifts")
@Controller("shifts")
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Get()
  @ApiOkResponse({ description: "List shifts" })
  findAll() {
    return this.shiftsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.shiftsService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ description: "Create shift" })
  create(@Body() dto: CreateShiftDto) {
    return this.shiftsService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateShiftDto) {
    return this.shiftsService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.shiftsService.remove(id);
  }
}
