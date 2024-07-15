import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProfessorDto } from 'src/Schemas/DTO/professir.dto';
import { IProfessor } from 'src/Schemas/Entity/IProfessor';
import { StudentService } from '../student/student.service';
import { ProfessorHandle } from '../HandleControllersEntity/ProfessorHandle';
import { UserService } from '../Abstact/user.service';
@Injectable()
export class ProfessorService extends UserService {
  jwt: JwtService;
  userModule: Model<IProfessor>;
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

  async getProfessorName(jwtId: string): Promise<string> {
    try {
      const decriptJwt = await this.decriptJwt(jwtId);
      const professor = await this.getUserById(decriptJwt);
      return professor.username;
    } catch (error) {
      throw new Error(`Failed to get professor name: ${error}`);
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

  async getProfessorById(id: string): Promise<IProfessor> {
    try {
      const decriptJwt = await this.decriptJwt(id);
      const professor = await this.professorModel.findById(decriptJwt);
      return professor;
    } catch (error) {
      throw new Error(`Failed to get professor by ID: ${error}`);
    }
  }

  async updateUsername(email: string, newName: string) {
    try {
      const username = await this.professorModel.findOneAndUpdate(
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
      throw new Error(`Failed to update username: ${error}`);
    }
  }

  async updateEmail(email: string, newName: string) {
    try {
      const username = await this.professorModel.findOneAndUpdate(
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
      throw new Error(`Failed to update email: ${error}`);
    }
  }

  async updatePassword(email: string, newName: string) {
    try {
      const username = await this.professorModel.findOneAndUpdate(
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
      throw new Error(`Failed to update password: ${error}`);
    }
  }
}
