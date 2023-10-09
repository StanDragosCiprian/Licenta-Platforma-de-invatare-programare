import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProfessorDto } from 'src/Schemas/DTO/professir.dto';
import { IProfessor } from 'src/Schemas/Entity/IProfessor';

@Injectable()
export class ProfessorService {
  constructor(
    @InjectModel('Professor') private professorModel: Model<IProfessor>,
  ) {}
  async createStudent(createProfessorDto: ProfessorDto): Promise<IProfessor> {
    const newProfessor = await new this.professorModel(createProfessorDto);
    return newProfessor.save();
  }
}
