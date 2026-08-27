import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { AttendanceStatus } from "../common/attendance-status.enum";
import { Employee } from "../employees/employee.entity";

@Entity("attendance_records")
@Unique(["employee", "date"])
export class AttendanceRecord {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Employee, (employee) => employee.attendanceRecords, {
    eager: true,
    onDelete: "CASCADE",
  })
  employee!: Employee;

  @Column({ type: "text" })
  date!: string;

  @Column({ type: "text", nullable: true })
  checkIn?: string | null;

  @Column({ type: "text", nullable: true })
  checkOut?: string | null;

  @Column({ type: "text" })
  status!: AttendanceStatus;

  @Column({ type: "text", nullable: true })
  note?: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
