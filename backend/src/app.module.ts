import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "node:path";
import { AttendanceModule } from "./attendance/attendance.module";
import { DepartmentsModule } from "./departments/departments.module";
import { EmployeesModule } from "./employees/employees.module";
import { ReportsModule } from "./reports/reports.module";
import { RolesModule } from "./roles/roles.module";
import { ShiftsModule } from "./shifts/shifts.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "..", "frontend"),
    }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: join(process.cwd(), "hotel-employee.sqlite"),
      autoLoadEntities: true,
      synchronize: true,
    }),
    DepartmentsModule,
    RolesModule,
    ShiftsModule,
    EmployeesModule,
    AttendanceModule,
    ReportsModule,
  ],
})
export class AppModule {}
