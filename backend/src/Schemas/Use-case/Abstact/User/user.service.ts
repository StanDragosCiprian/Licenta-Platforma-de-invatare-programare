import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { StudentDto } from 'src/Schemas/DTO/student.dto';
import { IStudent } from 'src/Schemas/Entity/IStudent';
import { ProfessorService } from '../../professor/professor.service';
import { IProfessor } from 'src/Schemas/Entity/IProfessor';
import { JwtService } from '@nestjs/jwt';
export abstract class UserService implements OnModuleInit {
  abstract userModule: Model<any>;
  abstract jwt: JwtService;
  onModuleInit() {
    this.userModule.watch().on('change', (change) => {
      console.log(change);
    });
  }
  async createUser(
    createStudentDto: StudentDto | ProfessorService,
  ): Promise<IStudent | IProfessor> {
    try {
      const newStudent = await new this.userModule(createStudentDto);
      return newStudent.save();
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create student');
    }
  }
  async logUser(
    email: string,
    password: string,
  ): Promise<IStudent | ProfessorService> {
    try {
      const user = await this.userModule.findOne({
        email: email,
        password: password,
      });
      return user;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to log user');
    }
  }
  async getUserById(id: string): Promise<IStudent | IProfessor> {
    try {
      const student = await this.userModule.findOne({
        _id: id,
      });
      return student;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get student');
    }
  }
  async getOneUserByCondition(
    condition: object,
  ): Promise<IStudent | IProfessor> {
    try {
      return await this.userModule.findOne(condition);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get student by email');
    }
  }
  async makeJwt(professorId: any) {
    try {
      if (professorId !== null) {
        const payload = { sub: professorId._id };
        return {
          access_token: await this.jwt.signAsync(payload),
        };
      }
      return {
        access_token: ' ',
      };
    } catch (error) {
      throw new Error(`Failed to make JWT: ${error}`);
    }
  }

  async decriptJwt(id: string) {
    try {
      const decodedToken = this.jwt.verify(id);
      return decodedToken.sub;
    } catch (error) {
      throw new Error(`Failed to decrypt JWT: ${error}`);
    }
  }
}
