import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AttendanceRecord } from "../attendance/attendance-record.entity";
import { Department } from "../departments/department.entity";
import { Role } from "../roles/role.entity";
import { Shift } from "../shifts/shift.entity";

@Entity("employees")
export class Employee {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  fullName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: "text", nullable: true })
  phone?: string | null;

  @ManyToOne(() => Department, (department) => department.employees, {
    eager: true,
    onDelete: "RESTRICT",
  })
  department!: Department;

  @ManyToOne(() => Role, (role) => role.employees, {
    eager: true,
    onDelete: "RESTRICT",
  })
  role!: Role;

  @ManyToOne(() => Shift, (shift) => shift.employees, {
    eager: true,
    onDelete: "RESTRICT",
  })
  shift!: Shift;

  @OneToMany(
    () => AttendanceRecord,
    (attendanceRecord) => attendanceRecord.employee,
  )
  attendanceRecords!: AttendanceRecord[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
