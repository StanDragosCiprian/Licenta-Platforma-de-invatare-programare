import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProfessorDto } from 'src/Schemas/DTO/professir.dto';
import { IProfessor } from 'src/Schemas/Entity/IProfessor';
import { StudentService } from '../student/student.service';
import { ProfessorHandle } from '../HandleControllersEntity/ProfessorHandle';
@Injectable()
export class ProfessorService implements OnModuleInit {
  async isEmailExist(email: string): Promise<boolean> {
    const professor = await this.professorModel.findOne({ email });
    return !!professor;
  }
  @Inject(StudentService)
  private readonly studentService: StudentService;
  constructor(
    @InjectModel('Professor') private professorModel: Model<IProfessor>,
    private jwtService: JwtService,
  ) {}
  async createProfessor(createProfessorDto: ProfessorDto): Promise<any> {
    try {
      const existingProfessor = await this.professorModel.findOne({
        email: createProfessorDto.email,
      });

      if (existingProfessor) {
        return `Professor with email ${createProfessorDto.email} already exists.`;
      }

      const newProfessor = new this.professorModel(createProfessorDto);
      await newProfessor.save();
      return true;
    } catch (error) {
      throw new Error(`Failed to create professor: ${error}`);
    }
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

  async getAllProfessorsCursId(): Promise<Set<Types.ObjectId>> {
    try {
      const professors: IProfessor[] = await this.professorModel.find();
      const coursId: Set<Types.ObjectId> = professors.reduce(
        (acc, professor) => {
          if (professor.coursesId.length > 0) {
            professor.coursesId.forEach((curs: Types.ObjectId) => {
              acc.add(curs);
            });
          }
          return acc;
        },
        new Set<Types.ObjectId>(),
      );
      return coursId;
    } catch (error) {
      throw new Error(`Failed to get all professors' course IDs: ${error}`);
    }
  }

  onModuleInit() {
    this.professorModel.watch().on('change', (change) => {
      console.log(change);
    });
  }
  async logUser(email: string, password: string): Promise<IProfessor> {
    try {
      const user = await this.professorModel.findOne({
        email: email,
        password: password,
      });
      return user;
    } catch (error) {
      throw new Error(`Failed to log user: ${error}`);
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

  async getProfessorByEmail(email: string): Promise<IProfessor> {
    try {
      return await this.professorModel.findOne({
        email: email,
      });
    } catch (error) {
      throw new Error(`Failed to get professor by email: ${error}`);
    }
  }

  async getProfessorName(jwtId: string): Promise<string> {
    try {
      const decriptJwt = await this.decriptJwt(jwtId);
      const professor = await this.getProfessor(decriptJwt);
      return professor.username;
    } catch (error) {
      throw new Error(`Failed to get professor name: ${error}`);
    }
  }

  async getStudentsId(students: string[]): Promise<Promise<Types.ObjectId>[]> {
    try {
      return await students.map(async (studentEmail: string) => {
        return await this.studentService.getStudentByEmail(studentEmail);
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

  async getProfessor(id: string): Promise<IProfessor> {
    try {
      const professor = await this.professorModel.findOne({
        _id: id,
      });
      return professor;
    } catch (error) {
      throw new Error(`Failed to get professor: ${error}`);
    }
  }

  async makeJwt(professorId: any) {
    try {
      if (professorId !== null) {
        const payload = { sub: professorId._id };
        return {
          access_token: await this.jwtService.signAsync(payload),
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
      const decodedToken = this.jwtService.verify(id);
      return decodedToken.sub;
    } catch (error) {
      throw new Error(`Failed to decrypt JWT: ${error}`);
    }
  }

  async updateUsername(email: string, newName: string) {
    try {
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
    } catch (error) {
      throw new Error(`Failed to update username: ${error}`);
    }
  }

  async updateEmail(email: string, newName: string) {
    try {
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
    } catch (error) {
      throw new Error(`Failed to update email: ${error}`);
    }
  }

  async updatePassword(email: string, newName: string) {
    try {
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
    } catch (error) {
      throw new Error(`Failed to update password: ${error}`);
    }
  }
}
