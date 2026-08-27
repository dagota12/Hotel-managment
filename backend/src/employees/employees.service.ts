import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DepartmentsService } from "../departments/departments.service";
import { RolesService } from "../roles/roles.service";
import { ShiftsService } from "../shifts/shifts.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { Employee } from "./employee.entity";

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
    private readonly departmentsService: DepartmentsService,
    private readonly rolesService: RolesService,
    private readonly shiftsService: ShiftsService,
  ) {}

  findAll(): Promise<Employee[]> {
    return this.employeesRepository.find({ order: { fullName: "ASC" } });
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException("Employee not found");
    }
    return employee;
  }

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const existingEmployee = await this.employeesRepository.findOne({
      where: { email: dto.email },
    });
    if (existingEmployee) {
      throw new ConflictException("Employee email already exists");
    }

    const [department, role, shift] = await Promise.all([
      this.departmentsService.findOne(dto.departmentId),
      this.rolesService.findOne(dto.roleId),
      this.shiftsService.findOne(dto.shiftId),
    ]);

    const employee = this.employeesRepository.create({
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      department,
      role,
      shift,
    });

    return this.employeesRepository.save(employee);
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);

    if (dto.email && dto.email !== employee.email) {
      const existingEmployee = await this.employeesRepository.findOne({
        where: { email: dto.email },
      });
      if (existingEmployee) {
        throw new ConflictException("Employee email already exists");
      }
    }

    if (dto.departmentId) {
      employee.department = await this.departmentsService.findOne(
        dto.departmentId,
      );
    }

    if (dto.roleId) {
      employee.role = await this.rolesService.findOne(dto.roleId);
    }

    if (dto.shiftId) {
      employee.shift = await this.shiftsService.findOne(dto.shiftId);
    }

    Object.assign(employee, {
      fullName: dto.fullName ?? employee.fullName,
      email: dto.email ?? employee.email,
      phone: dto.phone ?? employee.phone,
    });

    return this.employeesRepository.save(employee);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    const employee = await this.findOne(id);
    await this.employeesRepository.remove(employee);
    return { deleted: true };
  }
}
