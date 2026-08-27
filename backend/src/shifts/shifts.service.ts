import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateShiftDto } from "./dto/create-shift.dto";
import { UpdateShiftDto } from "./dto/update-shift.dto";
import { Shift } from "./shift.entity";

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftsRepository: Repository<Shift>,
  ) {}

  findAll(): Promise<Shift[]> {
    return this.shiftsRepository.find({ order: { startTime: "ASC" } });
  }

  async findOne(id: string): Promise<Shift> {
    const shift = await this.shiftsRepository.findOne({ where: { id } });
    if (!shift) {
      throw new NotFoundException("Shift not found");
    }
    return shift;
  }

  async create(dto: CreateShiftDto): Promise<Shift> {
    const existingShift = await this.shiftsRepository.findOne({
      where: { name: dto.name },
    });
    if (existingShift) {
      throw new ConflictException("Shift name already exists");
    }

    return this.shiftsRepository.save(this.shiftsRepository.create(dto));
  }

  async update(id: string, dto: UpdateShiftDto): Promise<Shift> {
    const shift = await this.findOne(id);

    if (dto.name && dto.name !== shift.name) {
      const existingShift = await this.shiftsRepository.findOne({
        where: { name: dto.name },
      });
      if (existingShift) {
        throw new ConflictException("Shift name already exists");
      }
    }

    Object.assign(shift, dto);
    return this.shiftsRepository.save(shift);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    const shift = await this.findOne(id);
    await this.shiftsRepository.remove(shift);
    return { deleted: true };
  }
}
