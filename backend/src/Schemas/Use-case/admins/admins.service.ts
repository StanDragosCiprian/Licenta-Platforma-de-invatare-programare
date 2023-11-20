import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAdmin } from 'src/Schemas/Entity/IAdmin';
import { ProfessorService } from '../professor/professor.service';
import { ProfessorDto } from 'src/Schemas/DTO/professir.dto';

@Injectable()
export class AdminsService {
  @Inject(ProfessorService)
  private readonly professorService: ProfessorService;
  constructor(
    @InjectModel('Admin') private adminModel: Model<IAdmin>,
    private jwtService: JwtService,
  ) {}
  onModuleInit() {
    this.adminModel.watch().on('change', (change) => {
      console.log(change);
    });
  }
  async logUser(email: string, password: string): Promise<IAdmin> {
    const user = await this.adminModel.findOne({
      email: email,
      password: password,
    });
    return user;
  }
  async getAdmin(id: string): Promise<IAdmin> {
    const admin = await this.adminModel.findOne({
      _id: id,
    });
    return admin;
  }
  async decriptJwt(id: string) {
    const decodedToken = this.jwtService.verify(id);
    return decodedToken.sub;
  }
  async addNewProfessor(professor: ProfessorDto) {
    await this.professorService.createProfessor(professor);
  }
}
