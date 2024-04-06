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
  async updatePassword(email: string, newName: string) {
    const username = await this.adminModel.findOneAndUpdate(
      { email: email }, // filter
      { password: newName }, // update
      { new: true }, // options
    );

    if (username === null) {
      return false;
    } else {
      return true;
    }
  }
  async updateEmail(email: string, newName: string) {
    const username = await this.adminModel.findOneAndUpdate(
      { email: email }, // filter
      { email: newName }, // update
      { new: true }, // options
    );

    if (username === null) {
      return false;
    } else {
      return true;
    }
  }
  async updateUsername(email: string, newName: string) {
    const username = await this.adminModel.findOneAndUpdate(
      { email: email }, // filter
      { username: newName }, // update
      { new: true }, // options
    );

    if (username === null) {
      return false;
    } else {
      return true;
    }
  }
  async logUser(email: string, password: string): Promise<IAdmin> {
    const user = await this.adminModel.findOne({
      email: email,
      password: password,
    });
    return user;
  }
  async switchProfessorCourses(email1: string, email2: string) {
    const professor1 = await this.professorService.getProfessorByEmail(email1);
    const professor2 = await this.professorService.getProfessorByEmail(email2);
    for (const c of professor1.coursesId) {
      professor2.coursesId.push(c);
    }
    await professor2.save();
    await this.professorService.deleteProfessor(email1);
  }
  async deleteStudents(email: string) {
    await this.professorService.deleteStudent(email);
  }
  async getAllStudents() {
    return await this.professorService.getAllStudent();
  }
  async deleteProfessor(email: string) {
    return await this.professorService.deleteProfessor(email);
  }
  async getAllProfessors() {
    return await this.professorService.getAllProfessors();
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
