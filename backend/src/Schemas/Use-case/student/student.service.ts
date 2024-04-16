import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IStudent } from 'src/Schemas/Entity/IStudent';
import { StudentDto } from 'src/Schemas/DTO/student.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class StudentService implements OnModuleInit {
  constructor(
    @InjectModel('Student') private studentModel: Model<IStudent>,
    private jwtService: JwtService,
  ) {}
  async createStudent(createStudentDto: StudentDto): Promise<IStudent> {
    try {
      const newStudent = await new this.studentModel(createStudentDto);
      return newStudent.save();
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create student');
    }
  }
  onModuleInit() {
    this.studentModel.watch().on('change', (change) => {
      console.log(change);
    });
  }
  async logUser(email: string, password: string): Promise<IStudent> {
    try {
      const user = await this.studentModel.findOne({
        email: email,
        password: password,
      });
      return user;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to log user');
    }
  }

  async getStudent(id: string): Promise<IStudent> {
    try {
      const student = await this.studentModel.findOne({
        _id: id,
      });
      return student;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get student');
    }
  }

  async getStudentByEmail(email: string): Promise<Types.ObjectId> {
    try {
      const student = await this.studentModel.findOne({
        email: email,
      });
      return student._id;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get student by email');
    }
  }

  async makeJwt(student: any) {
    try {
      if (student !== null) {
        const payload = { sub: student._id };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      }
      return {
        access_token: ' ',
      };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to make JWT');
    }
  }

  async decriptJwt(id: string) {
    try {
      const decodedToken = this.jwtService.verify(id);
      return decodedToken.sub;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to decrypt JWT');
    }
  }

  async updateUsername(email: string, newName: string) {
    try {
      const username = await this.studentModel.findOneAndUpdate(
        { email: email },
        { username: newName },
        { new: true },
      );

      if (username === null) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update username');
    }
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

  async updateEmail(email: string, newName: string) {
    try {
      const username = await this.studentModel.findOneAndUpdate(
        { email: email },
        { email: newName },
        { new: true },
      );

      if (username === null) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update email');
    }
  }

  async updatePassword(email: string, newName: string) {
    try {
      const username = await this.studentModel.findOneAndUpdate(
        { email: email },
        { password: newName },
        { new: true },
      );

      if (username === null) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update password');
    }
  }
}
