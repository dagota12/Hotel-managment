import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { AttendanceStatus } from "../common/attendance-status.enum";
import { EmployeesService } from "../employees/employees.service";
import { Employee } from "../employees/employee.entity";
import { AttendanceQueryDto } from "./dto/attendance-query.dto";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { AttendanceRecord } from "./attendance-record.entity";
import { TodayAttendanceRow } from "./today-attendance-row.interface";

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRepository: Repository<AttendanceRecord>,
    private readonly employeesService: EmployeesService,
  ) {}

  private getTodayDate(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private getCurrentTime(): string {
    return new Date().toTimeString().slice(0, 5);
  }

  private isLate(employee: Employee, checkInTime: string): boolean {
    return checkInTime > employee.shift.startTime;
  }

  private async findTodayRecord(
    employeeId: string,
  ): Promise<AttendanceRecord | null> {
    return this.attendanceRepository.findOne({
      where: {
        employee: { id: employeeId },
        date: this.getTodayDate(),
      },
    });
  }

  async create(dto: CreateAttendanceDto): Promise<AttendanceRecord> {
    const employee = await this.employeesService.findOne(dto.employeeId);

    const existingRecord = await this.attendanceRepository.findOne({
      where: {
        employee: { id: employee.id },
        date: dto.date,
      },
    });

    if (existingRecord) {
      throw new ConflictException(
        "Attendance already exists for this employee and date",
      );
    }

    const attendanceRecord = this.attendanceRepository.create({
      employee,
      date: dto.date,
      checkIn: dto.checkIn ?? null,
      checkOut: dto.checkOut ?? null,
      status: dto.status,
      note: dto.note ?? null,
    });

    return this.attendanceRepository.save(attendanceRecord);
  }

  async checkIn(employeeId: string): Promise<AttendanceRecord> {
    const employee = await this.employeesService.findOne(employeeId);
    const today = this.getTodayDate();
    const currentTime = this.getCurrentTime();
    const existingRecord = await this.findTodayRecord(employeeId);

    if (existingRecord?.checkIn) {
      throw new ConflictException("Employee already checked in today");
    }

    const attendanceRecord =
      existingRecord ??
      this.attendanceRepository.create({
        employee,
        date: today,
        checkOut: null,
        note: null,
      });

    attendanceRecord.employee = employee;
    attendanceRecord.date = today;
    attendanceRecord.checkIn = currentTime;
    attendanceRecord.status = this.isLate(employee, currentTime)
      ? AttendanceStatus.Late
      : AttendanceStatus.Present;

    return this.attendanceRepository.save(attendanceRecord);
  }

  async checkOut(employeeId: string): Promise<AttendanceRecord> {
    const attendanceRecord = await this.findTodayRecord(employeeId);

    if (!attendanceRecord) {
      throw new NotFoundException("No attendance record found for today");
    }

    if (!attendanceRecord.checkIn) {
      throw new ConflictException("Employee must check in before checking out");
    }

    if (attendanceRecord.checkOut) {
      throw new ConflictException("Employee already checked out today");
    }

    attendanceRecord.checkOut = this.getCurrentTime();

    return this.attendanceRepository.save(attendanceRecord);
  }

  async findToday(): Promise<TodayAttendanceRow[]> {
    const today = this.getTodayDate();
    const employees = await this.employeesService.findAll();
    const records = await this.attendanceRepository.find({
      where: { date: today },
    });

    const recordsByEmployeeId = new Map<string, AttendanceRecord>();
    for (const record of records) {
      recordsByEmployeeId.set(record.employee.id, record);
    }

    return employees.map((employee) => {
      const record = recordsByEmployeeId.get(employee.id);
      return {
        employeeId: employee.id,
        employeeName: employee.fullName,
        department: employee.department.name,
        shift: employee.shift.name,
        checkIn: record?.checkIn ?? null,
        checkOut: record?.checkOut ?? null,
        status: record?.status ?? "NOT_MARKED",
      };
    });
  }

  async findAll(query: AttendanceQueryDto): Promise<AttendanceRecord[]> {
    const where: Record<string, unknown> = {};

    if (query.employeeId) {
      where.employee = { id: query.employeeId };
    }

    if (query.from && query.to) {
      where.date = Between(query.from, query.to);
    } else if (query.from) {
      where.date = Between(query.from, query.from);
    } else if (query.to) {
      where.date = Between(query.to, query.to);
    }

    if (query.status) {
      where.status = query.status;
    }

    return this.attendanceRepository.find({
      where: where as never,
      order: { date: "DESC", createdAt: "DESC" },
    });
  }

  async findOne(id: string): Promise<AttendanceRecord> {
    const attendanceRecord = await this.attendanceRepository.findOne({
      where: { id },
    });
    if (!attendanceRecord) {
      throw new NotFoundException("Attendance record not found");
    }
    return attendanceRecord;
  }

  countStatus(records: AttendanceRecord[], status: AttendanceStatus): number {
    return records.filter((record) => record.status === status).length;
  }
}
