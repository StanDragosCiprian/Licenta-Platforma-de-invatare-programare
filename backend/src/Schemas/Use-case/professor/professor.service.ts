import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProfessorDto } from 'src/Schemas/DTO/professir.dto';
import { IProfessor } from 'src/Schemas/Entity/IProfessor';
import { StudentService } from '../student/student.service';

@Injectable()
export class ProfessorService implements OnModuleInit {
  @Inject(StudentService)
  private readonly studentService: StudentService;
  constructor(
    @InjectModel('Professor') private professorModel: Model<IProfessor>,
    private jwtService: JwtService,
  ) {}
  async createProfessor(createProfessorDto: ProfessorDto): Promise<IProfessor> {
    const newProfessor = await new this.professorModel(createProfessorDto);
    return newProfessor.save();
  }
  async deleteProfessor(email: string) {
    await this.professorModel.findOneAndDelete({
      email: email,
    });
  }
  async deleteStudent(email: string) {
    await this.studentService.deleteStudent(email);
  }
  async getAllStudent() {
    return await this.studentService.getAllStudents();
  }
  async getAllProfessors(): Promise<IProfessor[]> {
    return await this.professorModel.find();
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
  async getProfessorByCours(idCours: Types.ObjectId) {
    const professor = await this.professorModel.findOne({
      coursesId: idCours,
    });
    return professor.email;
  }
  async getCoursesFromProfessorByEmail(email: string) {
    const professor = await this.professorModel.findOne({
      email: email,
    });
    return professor.coursesId;
  }
  async getProfessorByEmail(email: string): Promise<IProfessor> {
    return await this.professorModel.findOne({
      email: email,
    });
  }
  async getProfessorName(jwtId: string): Promise<string> {
    const decriptJwt = await this.decriptJwt(jwtId);
    const professor = await this.getProfessor(decriptJwt);
    return professor.username;
  }
  async getStudentsId(students: string[]): Promise<Promise<Types.ObjectId>[]> {
    return await students.map(async (studentEmail: string) => {
      return await this.studentService.getStudentByEmail(studentEmail);
    });
  }
  async getProfessorById(id: string): Promise<IProfessor> {
    const decriptJwt = await this.decriptJwt(id);
    const professor = await this.professorModel.findById(decriptJwt);
    return professor;
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
  async updateUsername(email: string, newName: string) {
    const username = await this.professorModel.findOneAndUpdate(
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
  async updateEmail(email: string, newName: string) {
    const username = await this.professorModel.findOneAndUpdate(
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
    const username = await this.professorModel.findOneAndUpdate(
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
