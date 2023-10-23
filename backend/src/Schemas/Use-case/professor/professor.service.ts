import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProfessorDto } from 'src/Schemas/DTO/professir.dto';
import { IProfessor } from 'src/Schemas/Entity/IProfessor';

@Injectable()
export class ProfessorService implements OnModuleInit {
  constructor(
    @InjectModel('Professor') private professorModel: Model<IProfessor>,
  ) {}
  async createProfessor(createProfessorDto: ProfessorDto): Promise<IProfessor> {
    const newProfessor = await new this.professorModel(createProfessorDto);
    return newProfessor.save();
  }
  onModuleInit() {
    this.professorModel.watch().on('change', (change) => {
      console.log(change);
    });
  }
  async logUser(email: string, password: string): Promise<string> {
    const user = await this.professorModel.findOne({
      email: email,
      password: password,
    });
    if (user === null) {
      return 'No_Professor';
    }
    return user._id.toString();
  }
  async getProfessor(id: string): Promise<IProfessor> {
    const professor = await this.professorModel.findOne({
      _id: id,
    });
    console.log(professor);
    return professor;
  }
}
