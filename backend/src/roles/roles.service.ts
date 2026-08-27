import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Role } from "./role.entity";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  findAll(): Promise<Role[]> {
    return this.rolesRepository.find({ order: { name: "ASC" } });
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException("Role not found");
    }
    return role;
  }

  async create(dto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.rolesRepository.findOne({
      where: { name: dto.name },
    });
    if (existingRole) {
      throw new ConflictException("Role name already exists");
    }

    return this.rolesRepository.save(this.rolesRepository.create(dto));
  }

  async update(id: string, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    if (dto.name && dto.name !== role.name) {
      const existingRole = await this.rolesRepository.findOne({
        where: { name: dto.name },
      });
      if (existingRole) {
        throw new ConflictException("Role name already exists");
      }
    }

    Object.assign(role, dto);
    return this.rolesRepository.save(role);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    const role = await this.findOne(id);
    await this.rolesRepository.remove(role);
    return { deleted: true };
  }
}
