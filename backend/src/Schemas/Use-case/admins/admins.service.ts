import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAdmin } from 'src/Schemas/Entity/IAdmin';
import { ProfessorService } from '../professor/professor.service';
import { ProfessorDto } from 'src/Schemas/DTO/professir.dto';

@Injectable()
export class AdminsService {
  async isEmailExist(email: string): Promise<boolean> {
    const admin = await this.adminModel.findOne({ email });
    return !!admin;
  }
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
    try {
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
    } catch (error) {
      // Handle the exception here
      console.error(error);
      throw error; // Rethrow the exception to be handled by the caller
    }
  }
  async updateEmail(email: string, newName: string) {
    try {
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
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async updateUsername(email: string, newName: string) {
    try {
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
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async logUser(email: string, password: string): Promise<IAdmin> {
    try {
      const user = await this.adminModel.findOne({
        email: email,
        password: password,
      });
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async switchProfessorCourses(email1: string, email2: string) {
    try {
      const professor1 =
        await this.professorService.getProfessorByEmail(email1);
      const professor2 =
        await this.professorService.getProfessorByEmail(email2);
      for (const c of professor1.coursesId) {
        professor2.coursesId.push(c);
      }
      await professor2.save();
      await this.professorService.deleteProfessor(email1);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async deleteStudents(email: string) {
    try {
      await this.professorService.deleteStudent(email);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getAllStudents() {
    return await this.professorService.getAllStudent();
  }
  async deleteProfessor(email: string) {
    try {
      return await this.professorService.deleteProfessor(email);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getAllProfessors() {
    try {
      return await this.professorService.getAllProfessors();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getAdmin(id: string): Promise<IAdmin> {
    try {
      const admin = await this.adminModel.findOne({
        _id: id,
      });
      return admin;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async decriptJwt(id: string) {
    try {
      const decodedToken = this.jwtService.verify(id);
      return decodedToken.sub;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async addNewProfessor(professor: ProfessorDto) {
    try {
      return await this.professorService.createProfessor(professor);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
