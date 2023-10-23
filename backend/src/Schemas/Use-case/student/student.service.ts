import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IStudent } from 'src/Schemas/Entity/IStudent';
import { StudentDto } from 'src/Schemas/DTO/student.dto';
@Injectable()
export class StudentService implements OnModuleInit {
  constructor(@InjectModel('Student') private studentModel: Model<IStudent>) {}
  async createStudent(createStudentDto: StudentDto): Promise<IStudent> {
    const newStudent = await new this.studentModel(createStudentDto);
    return newStudent.save();
  }
  onModuleInit() {
    this.studentModel.watch().on('change', (change) => {
      console.log(change);
    });
  }
  async logUser(email: string, password: string): Promise<string> {
    const user = await this.studentModel.findOne({
      email: email,
      password: password,
    });
    if (user === null) {
      return 'No_Student';
    }
    return user._id.toString();
  }
  async getStudent(id: string): Promise<IStudent> {
    const student = await this.studentModel.findOne({
      _id: id,
    });
    console.log(student);
    return student;
  }
}
