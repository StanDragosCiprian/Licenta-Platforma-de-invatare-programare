import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProfessorDto } from 'src/Schemas/DTO/professir.dto';
import { IProfessor } from 'src/Schemas/Entity/IProfessor';

@Injectable()
export class ProfessorService implements OnModuleInit {
  constructor(
    @InjectModel('Professor') private professorModel: Model<IProfessor>,
    private jwtService: JwtService,
  ) {}
  async createProfessor(createProfessorDto: ProfessorDto): Promise<IProfessor> {
    const newProfessor = await new this.professorModel(createProfessorDto);
    return newProfessor.save();
  }
  async getAllProfessorsCursId(): Promise<Set<Types.ObjectId>> {
    const professors: IProfessor[] = await this.professorModel.find();
    const coursId: Set<Types.ObjectId> = professors.reduce((acc, professor) => {
      if (professor.coursesId.length > 0) {
        professor.coursesId.forEach((curs: Types.ObjectId) => {
          acc.add(curs);
        });
      }
      return acc;
    }, new Set<Types.ObjectId>());
    return coursId;
  }

  onModuleInit() {
    this.professorModel.watch().on('change', (change) => {
      console.log(change);
    });
  }
  async logUser(email: string, password: string): Promise<IProfessor> {
    const user = await this.professorModel.findOne({
      email: email,
      password: password,
    });
    return user;
  }
  async getProfessorName(jwtId: string): Promise<string> {
    const decriptJwt = await this.decriptJwt(jwtId);
    const professor = await this.getProfessor(decriptJwt);
    return professor.username;
  }
  async getProfessor(id: string): Promise<IProfessor> {
    const professor = await this.professorModel.findOne({
      _id: id,
    });
    return professor;
  }
  async makeJwt(professorId: any) {
    if (professorId !== null) {
      const payload = { sub: professorId._id };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
    return {
      access_token: ' ',
    };
  }

  async decriptJwt(id: string) {
    const decodedToken = this.jwtService.verify(id);
    return decodedToken.sub;
  }
}
