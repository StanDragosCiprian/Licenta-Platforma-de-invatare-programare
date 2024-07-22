import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IProfessor } from 'src/Schemas/Entity/IProfessor';
import { StudentService } from '../student/student.service';
import { ProfessorHandle } from '../HandleControllersEntity/ProfessorHandle';
import { UserService } from '../Abstact/User/user.service';
@Injectable()
export class ProfessorService extends UserService {
  jwt: JwtService;
  userModule: Model<IProfessor>;
  private secretKeyForEmail =
    '3fa4fb188c1f45c1cb1a8bd80cef4dfce01705d9ea9b151f04eb98aa396fbace';
  async isEmailExist(email: string): Promise<boolean> {
    const professor = await this.professorModel.findOne({ email });
    return !!professor;
  }
  @Inject(StudentService)
  private readonly studentService: StudentService;
  constructor(
    @InjectModel('Professor') private professorModel: Model<IProfessor>,
    private jwtService: JwtService,
  ) {
    super();
    this.userModule = this.professorModel;
    this.jwt = this.jwtService;
  }
  private async deletCourses(email: string) {
    try {
      const professor = await this.professorModel.findOne({
        email: email,
      });
      professor.coursesId = [];
      await professor.save();
    } catch (error) {
      throw new Error(`Failed to delete professor: ${error}`);
    }
  }
  async createJWT(text: string): Promise<string> {
    const payload = { text };
    return this.jwtService.sign(payload, { secret: this.secretKeyForEmail });
  }

  async verifyJWT(token: string): Promise<string> {
    const payload = await this.jwtService.verify(token, {
      secret: this.secretKeyForEmail,
    });
    return payload.text;
  }

  async deleteProfessor(email: string) {
    try {
      await this.deletCourses(email);
      await this.professorModel.findOneAndDelete({
        email: email,
      });
    } catch (error) {
      throw new Error(`Failed to delete professor: ${error}`);
    }
  }
  public async getProfessor(id: string): Promise<IProfessor> {
    return (await this.getUser(id)) as IProfessor;
  }
  async encryptProfessor(text: string) {
    try {
      const professorHandle = new ProfessorHandle();
      professorHandle.setProfessorService(this);
      return await professorHandle.encryptText(text);
    } catch (error) {
      throw new Error(`Failed to encrypt professor: ${error}`);
    }
  }

  async deleteStudent(email: string) {
    try {
      await this.studentService.deleteStudent(email);
    } catch (error) {
      throw new Error(`Failed to delete student: ${error}`);
    }
  }

  async getAllStudent() {
    try {
      return await this.studentService.getAllStudents();
    } catch (error) {
      throw new Error(`Failed to get all students: ${error}`);
    }
  }

  async getAllProfessors(): Promise<IProfessor[]> {
    try {
      return await this.professorModel.find();
    } catch (error) {
      throw new Error(`Failed to get all professors: ${error}`);
    }
  }

  async getAllProfessorsCourseNameId(): Promise<Set<Types.ObjectId>> {
    try {
      const professors: IProfessor[] = await this.professorModel.find();
      const courseId: Set<Types.ObjectId> = professors.reduce(
        (acc, professor) => {
          if (professor.coursesId.length > 0) {
            professor.coursesId.forEach((courses: Types.ObjectId) => {
              acc.add(courses);
            });
          }
          return acc;
        },
        new Set<Types.ObjectId>(),
      );
      return courseId;
    } catch (error) {
      throw new Error(`Failed to get all professors' course IDs: ${error}`);
    }
  }

  async getProfessorByCours(idCours: Types.ObjectId) {
    try {
      const professor = await this.professorModel.findOne({
        coursesId: idCours,
      });
      return professor.email;
    } catch (error) {
      throw new Error(`Failed to get professor by course: ${error}`);
    }
  }

  async getCoursesFromProfessorByEmail(email: string) {
    try {
      const professor = await this.professorModel.findOne({
        email: email,
      });
      return professor.coursesId;
    } catch (error) {
      throw new Error(
        `Failed to get courses from professor by email: ${error}`,
      );
    }
  }

  async getStudentsId(students: string[]): Promise<Promise<Types.ObjectId>[]> {
    try {
      return await students.map(async (studentEmail: string) => {
        return (
          await this.studentService.getOneUserByCondition({
            email: studentEmail,
          })
        )._id;
      });
    } catch (error) {
      throw new Error(`Failed to get students ID: ${error}`);
    }
  }
}
