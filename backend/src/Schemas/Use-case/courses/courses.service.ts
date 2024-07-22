import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ICourses } from 'src/Schemas/Entity/ICourses';
import { ProfessorService } from '../professor/professor.service';
import { FILELOCATION } from 'EnviormentVariable';
import * as fs from 'fs';
import { ProfessorHandle } from '../HandleControllersEntity/ProfessorHandle';
import { CoursesHandle } from '../HandleControllersEntity/CoursesHandle';
import { EmptyClass } from '../Abstact/Profile/Profile.controller';
import { ProfessorCoursesAdder } from './courses_professor/course.professor.service';
import { CoursesComponents } from './courses.components.service';
import { CoursesCRUD } from './courses_crud/courses.crud.service';
const professorHandle = new ProfessorHandle();
@Injectable()
export class CoursesService extends ProfessorCoursesAdder(
  CoursesComponents(CoursesCRUD(EmptyClass)),
) {
  _coursesModel: Model<ICourses>;
  _professorService: ProfessorService;
  constructor(
    @InjectModel('Courses') private coursesModel: Model<ICourses>,
    @Inject(ProfessorService)
    private readonly professorService: ProfessorService,
  ) {
    super();
    this._coursesModel = this.coursesModel;
    this._coursesModel = this.coursesModel;
    this._professorService = this.professorService;
    this._professorService = this.professorService;
  }

  public async renameFile(
    oldName: string,
    newCourse: string,
    courseId: Types.ObjectId[],
  ) {
    try {
      fs.renameSync(
        `${FILELOCATION}\\backend\\src\\VideoTutorial\\${oldName}`,
        `${FILELOCATION}\\backend\\src\\VideoTutorial\\${newCourse}`,
      );
      const courseHandle = new CoursesHandle();
      courseHandle.setCourseModel(this.coursesModel);
      await courseHandle.changeDirectoryfromCourse(
        courseId,
        oldName,
        newCourse,
      );
    } catch (error) {
      throw new Error(`Error while renaming file: ${error}`);
    }
  }

  async findCoursFromProfessorEmail(email: string, coursName: string) {
    try {
      professorHandle.setProfessorService(this.professorService);
      return await professorHandle.findCoursFromProfessorEmail(
        email,
        coursName,
        this.coursesModel,
      );
    } catch (error) {
      throw new Error(
        `Error while finding course from professor email: ${error}`,
      );
    }
  }

  async findCoursFromProfessorId(id: string, coursName: string) {
    try {
      professorHandle.setProfessorService(this.professorService);
      return await professorHandle.findCoursFromProfessorId(
        id,
        coursName,
        this.coursesModel,
      );
    } catch (error) {
      throw new Error(`Error while finding course from professor ID: ${error}`);
    }
  }

  async getCourseByName(courseName: string) {
    try {
      return await this.coursesModel.findOne({ name: courseName });
    } catch (error) {
      throw new Error(`Error while getting course by name: ${error}`);
    }
  }

  async getCoursFromProfessor(email: string, coursName: string, id: string) {
    try {
      const decryptedEmail = await this.decryptText(email);
      const professor =
        await this.professorService.getCoursesFromProfessorByEmail(
          decryptedEmail,
        );
      for (const c of professor) {
        const cours = await this.takeCoursId(coursName);
        if (c.toString() === cours.toString()) {
          return (await this.takeCours(cours)).courses[id];
        }
      }
      return false;
    } catch (error) {
      throw new Error(`Error while getting course from professor: ${error}`);
    }
  }
  async findCourseWithProfessor(courseId: Types.ObjectId): Promise<any> {
    try {
      return await this.professorService.getProfessorByCours(courseId);
    } catch (error) {
      throw new Error(`Error while finding course with professor: ${error}`);
    }
  }

  async getProfessor(id) {
    return await this.professorService.getProfessor(id);
  }

  async changeIndex(
    courseName: string,
    drag: string,
    drop: string,
  ): Promise<void> {
    try {
      const courses = await this.coursesModel.findOne({ name: courseName });
      const temp = courses.courses[Number(drag)];
      courses.courses[Number(drag)] = courses.courses[Number(drop)];
      courses.courses[Number(drop)] = temp;
      courses.save();
    } catch (error) {
      throw new Error(`Error while changing index: ${error}`);
    }
  }

  async decryptProfessor(id: string) {
    try {
      return await this.professorService.decriptJwt(id);
    } catch (error) {
      throw new Error(`Error while decrypting professor: ${error}`);
    }
  }
}
