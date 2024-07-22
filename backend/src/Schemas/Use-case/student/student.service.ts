import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IStudent } from 'src/Schemas/Entity/IStudent';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../Abstact/User/user.service';
@Injectable()
export class StudentService extends UserService {
  jwt: JwtService;
  userModule: Model<IStudent>;
  constructor(
    @InjectModel('Student') private studentModel: Model<IStudent>,
    private jwtService: JwtService,
  ) {
    super();
    this.userModule = this.studentModel;
    this.jwt = this.jwtService;
  }

  async deleteStudent(email: string) {
    try {
      await this.studentModel.findOneAndDelete({ email: email });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to delete student');
    }
  }

  async getAllStudents() {
    try {
      return await this.studentModel.find();
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get all students');
    }
  }
}
