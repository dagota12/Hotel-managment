import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DepartmentsModule } from "../departments/departments.module";
import { Role } from "../roles/role.entity";
import { RolesModule } from "../roles/roles.module";
import { Shift } from "../shifts/shift.entity";
import { ShiftsModule } from "../shifts/shifts.module";
import { Employee } from "./employee.entity";
import { EmployeesController } from "./employees.controller";
import { EmployeesService } from "./employees.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Role, Shift]),
    DepartmentsModule,
    RolesModule,
    ShiftsModule,
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
