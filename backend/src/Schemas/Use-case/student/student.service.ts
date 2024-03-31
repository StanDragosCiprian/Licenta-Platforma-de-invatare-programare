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
    const newStudent = await new this.studentModel(createStudentDto);
    return newStudent.save();
  }
  onModuleInit() {
    this.studentModel.watch().on('change', (change) => {
      console.log(change);
    });
  }
  async logUser(email: string, password: string): Promise<IStudent> {
    const user = await this.studentModel.findOne({
      email: email,
      password: password,
    });
    return user;
  }
  async getStudent(id: string): Promise<IStudent> {
    const student = await this.studentModel.findOne({
      _id: id,
    });
    return student;
  }
  async getStudentByEmail(email: string): Promise<Types.ObjectId> {
    const student = await this.studentModel.findOne({
      email: email,
    });
    return student._id;
  }
  async makeJwt(student: any) {
    if (student !== null) {
      const payload = { sub: student._id };
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
  async updateUsername(email: string, newName: string) {
    const username = await this.studentModel.findOneAndUpdate(
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
  async deleteStudent(email: string) {
    await this.studentModel.findOneAndDelete({ email: email });
  }
  async getAllStudents() {
    return await this.studentModel.find();
  }
  async updateEmail(email: string, newName: string) {
    const username = await this.studentModel.findOneAndUpdate(
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
  async updatePassword(email: string, newName: string) {
    const username = await this.studentModel.findOneAndUpdate(
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
}
