import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Department } from "./department.entity";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentsRepository: Repository<Department>,
  ) {}

  findAll(): Promise<Department[]> {
    return this.departmentsRepository.find({ order: { name: "ASC" } });
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentsRepository.findOne({
      where: { id },
    });
    if (!department) {
      throw new NotFoundException("Department not found");
    }
    return department;
  }

  async create(dto: CreateDepartmentDto): Promise<Department> {
    const existingDepartment = await this.departmentsRepository.findOne({
      where: { name: dto.name },
    });
    if (existingDepartment) {
      throw new ConflictException("Department name already exists");
    }

    return this.departmentsRepository.save(
      this.departmentsRepository.create(dto),
    );
  }

  async update(id: string, dto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findOne(id);

    if (dto.name && dto.name !== department.name) {
      const existingDepartment = await this.departmentsRepository.findOne({
        where: { name: dto.name },
      });
      if (existingDepartment) {
        throw new ConflictException("Department name already exists");
      }
    }

    Object.assign(department, dto);
    return this.departmentsRepository.save(department);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    const department = await this.findOne(id);
    await this.departmentsRepository.remove(department);
    return { deleted: true };
  }
}
