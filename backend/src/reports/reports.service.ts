import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { AttendanceStatus } from "../common/attendance-status.enum";
import { AttendanceRecord } from "../attendance/attendance-record.entity";
import { Employee } from "../employees/employee.entity";
import { AttendanceReportRow } from "./attendance-report-row.interface";
import { DepartmentAttendanceReportRow } from "./department-attendance-report-row.interface";

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRepository: Repository<AttendanceRecord>,
  ) {}

  async attendanceReport(
    from?: string,
    to?: string,
  ): Promise<AttendanceReportRow[]> {
    if (!from || !to) {
      throw new BadRequestException(
        "Both from and to query parameters are required",
      );
    }

    const employees = await this.employeesRepository.find({
      order: { fullName: "ASC" },
    });
    const attendanceRecords = await this.attendanceRepository.find({
      where: {
        date: Between(from, to),
      },
      order: {
        date: "ASC",
      },
    });

    const attendanceByEmployeeId = new Map<string, AttendanceRecord[]>();

    for (const record of attendanceRecords) {
      const employeeId = record.employee.id;
      const currentRecords = attendanceByEmployeeId.get(employeeId) ?? [];
      currentRecords.push(record);
      attendanceByEmployeeId.set(employeeId, currentRecords);
    }

    return employees.map((employee): AttendanceReportRow => {
      const records = attendanceByEmployeeId.get(employee.id) ?? [];
      const present = records.filter(
        (record) => record.status === AttendanceStatus.Present,
      ).length;
      const absent = records.filter(
        (record) => record.status === AttendanceStatus.Absent,
      ).length;
      const late = records.filter(
        (record) => record.status === AttendanceStatus.Late,
      ).length;
      const total = records.length;
      const rate =
        total === 0 ? 0 : Number((((present + late) / total) * 100).toFixed(1));

      return {
        employeeId: employee.id,
        employeeName: employee.fullName,
        department: employee.department.name,
        role: employee.role.name,
        shift: employee.shift.name,
        present,
        absent,
        late,
        total,
        rate,
      };
    });
  }

  async departmentAttendanceReport(
    from?: string,
    to?: string,
  ): Promise<DepartmentAttendanceReportRow[]> {
    if (!from || !to) {
      throw new BadRequestException(
        "Both from and to query parameters are required",
      );
    }

    const employees = await this.employeesRepository.find({
      order: { fullName: "ASC" },
    });
    const attendanceRecords = await this.attendanceRepository.find({
      where: {
        date: Between(from, to),
      },
      order: {
        date: "ASC",
      },
    });

    const attendanceByEmployeeId = new Map<string, AttendanceRecord[]>();

    for (const record of attendanceRecords) {
      const employeeId = record.employee.id;
      const currentRecords = attendanceByEmployeeId.get(employeeId) ?? [];
      currentRecords.push(record);
      attendanceByEmployeeId.set(employeeId, currentRecords);
    }

    const departmentById = new Map<
      string,
      {
        departmentId: string;
        departmentName: string;
        employees: number;
        present: number;
        absent: number;
        late: number;
        total: number;
      }
    >();

    for (const employee of employees) {
      const departmentId = employee.department.id;
      const currentDepartment = departmentById.get(departmentId) ?? {
        departmentId,
        departmentName: employee.department.name,
        employees: 0,
        present: 0,
        absent: 0,
        late: 0,
        total: 0,
      };

      const records = attendanceByEmployeeId.get(employee.id) ?? [];
      const present = records.filter(
        (record) => record.status === AttendanceStatus.Present,
      ).length;
      const absent = records.filter(
        (record) => record.status === AttendanceStatus.Absent,
      ).length;
      const late = records.filter(
        (record) => record.status === AttendanceStatus.Late,
      ).length;
      const total = records.length;

      currentDepartment.employees += 1;
      currentDepartment.present += present;
      currentDepartment.absent += absent;
      currentDepartment.late += late;
      currentDepartment.total += total;

      departmentById.set(departmentId, currentDepartment);
    }

    return Array.from(departmentById.values())
      .sort((left, right) =>
        left.departmentName.localeCompare(right.departmentName),
      )
      .map((department): DepartmentAttendanceReportRow => {
        const rate =
          department.total === 0
            ? 0
            : Number(
                (
                  ((department.present + department.late) / department.total) *
                  100
                ).toFixed(1),
              );

        return {
          departmentId: department.departmentId,
          departmentName: department.departmentName,
          employees: department.employees,
          present: department.present,
          absent: department.absent,
          late: department.late,
          total: department.total,
          rate,
        };
      });
  }
}
