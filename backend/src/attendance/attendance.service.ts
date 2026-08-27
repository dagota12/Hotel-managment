import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { AttendanceStatus } from "../common/attendance-status.enum";
import { EmployeesService } from "../employees/employees.service";
import { AttendanceQueryDto } from "./dto/attendance-query.dto";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { AttendanceRecord } from "./attendance-record.entity";

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRepository: Repository<AttendanceRecord>,
    private readonly employeesService: EmployeesService,
  ) {}

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
