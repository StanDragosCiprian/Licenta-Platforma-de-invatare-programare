import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { LogDto } from 'src/Schemas/DTO/log.dto';
import { JwtService } from '@nestjs/jwt';
import { Cookies } from 'src/Cookie/cookie';
import { AdminGuard } from 'src/auth/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
//import { diskStorage } from 'multer';
import * as Excel from 'exceljs';
import { Types } from 'mongoose';
import { ProfessorDto } from 'src/Schemas/DTO/professir.dto';
import { IAdmin } from 'src/Schemas/Entity/IAdmin';
import { diskStorage } from 'multer';
import { EmailAlreadyExistsException } from '../ErrorInterceptor';
import { Response } from 'express';
import * as fs from 'fs';
@Controller('admin')
export class AdminsController {
  constructor(
    private readonly adminService: AdminsService,
    private jwtService: JwtService,
  ) {}
  @Get('/all/students')
  @UseGuards(AdminGuard)
  async getAllStudents() {
    try {
      const students = await this.adminService.getAllStudents();
      return students.map((student) => {
        return { username: student.username, email: student.email };
      });
    } catch (error) {
      // Handle the exception here
      console.error(error);
      throw error; // Rethrow the exception to be handled by the global exception handler
    }
  }
  @Post('/switch/professor/courses')
  @UseGuards(AdminGuard)
  async switchProfessorCourses(
    @Body() professor: { email1: string; email2: string },
  ) {
    try {
      await this.adminService.switchProfessorCourses(
        professor.email1,
        professor.email2,
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Post('/delete/professor')
  @UseGuards(AdminGuard)
  async deleteProfessor(@Body() professor: { email: string }) {
    try {
      return await this.adminService.deleteProfessor(professor.email);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  @Post('/delete/student')
  @UseGuards(AdminGuard)
  async deleteStudent(@Body() student: { email: string }) {
    try {
      return await this.adminService.deleteStudents(student.email);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  @Get('/all/professors')
  @UseGuards(AdminGuard)
  async getAllProfessor() {
    try {
      const allProfessors = await this.adminService.getAllProfessors();
      return allProfessors.map((professor) => {
        return { username: professor.username, email: professor.email };
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  private extractFilenameParts(imagePath: string): string[] {
    const parts = imagePath.split(/\/|\\/);
    const filename = parts.pop() || '';
    const filenameParts = filename.split('.');
    return filenameParts;
  }
  @Post('/upload/profile/image')
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination:
          'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Image\\Profile\\Professor',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}_${file.originalname}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg') {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type. Only JPEG is allowed.'), false);
        }
      },
    }),
  )
  async upload(@UploadedFile() file, @Cookies('id') id: string) {
    try {
      const admin: any = await this.getAdmin(id);
      if (admin.profileImage !== 'http://localhost:3000/default/img') {
        admin.profileImage = admin.profileImage.replace(
          'http://localhost:3000/professor/profile',
          'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Image\\Profile\\Professor\\',
        );
        admin.profileImage = admin.profileImage.replace(/[/\\]/g, '\\');
        const profileImage = admin.profileImage.replace(/\\jpg$/, '.jpg');

        fs.unlinkSync(profileImage);
      }
      const test = this.extractFilenameParts(file.path);

      admin.profileImage = `http://localhost:3000/professor/profile/${test[0]}/${test[1]}`;
      await admin.save();
      return { path: true };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  @Post('/is/email/exist')
  async isEmailExist(@Body() body: { email: string }, @Res() res: Response) {
    try {
      const isEmail = await this.adminService.isEmailExist(body.email);
      if (isEmail) {
        throw new EmailAlreadyExistsException();
      }
      return res.status(200).send(true);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  @Post('/update/username')
  @UseGuards(AdminGuard)
  async updateUsername(@Body() body: any, @Cookies('id') id: string) {
    try {
      const student = await this.getAdmin(id);
      if (typeof student !== 'string') {
        if (student.email === body.email) {
          return await this.adminService.updateUsername(
            body.email,
            body.newValue,
          );
        }
      }
      return false;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  @Post('/update/email')
  @UseGuards(AdminGuard)
  async updateEmail(@Body() body: any, @Cookies('id') id: string) {
    try {
      const student = await this.getAdmin(id);
      if (typeof student !== 'string') {
        if (student.email === body.email) {
          return await this.adminService.updateEmail(body.email, body.newValue);
        }
      }
      return false;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  @Post('/update/password')
  @UseGuards(AdminGuard)
  async updatePassword(@Body() body: any, @Cookies('id') id: string) {
    try {
      const student = await this.getAdmin(id);
      if (typeof student !== 'string') {
        if (student.email === body.email) {
          return await this.adminService.updatePassword(
            body.email,
            body.newValue,
          );
        }
      }
      return false;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  @Post('/log')
  async logAdmin(@Body() log: LogDto): Promise<{ access_token: string }> {
    try {
      const logAdmin = await this.adminService.logUser(log.email, log.password);
      if (logAdmin !== null) {
        const payload = { sub: logAdmin._id };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      }
      return {
        access_token: ' ',
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  @Get('/get')
  @UseGuards(AdminGuard)
  async getAdmin(@Cookies('id') id: string): Promise<IAdmin | string> {
    try {
      const decodedToken = await this.adminService.decriptJwt(id);
      const admin = this.adminService.getAdmin(decodedToken);
      if (admin === null) {
        return ' ';
      }
      return admin;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  @Get('/isAdmin')
  async verifyAdmin(@Cookies('id') id: string): Promise<boolean> {
    try {
      const decodedToken = await this.adminService.decriptJwt(id);
      const admin = await this.adminService.getAdmin(decodedToken);

      if (admin === null) {
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Post('/exel')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'application/vnd.ms-excel', // for older Excel files (xls)
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // for newer Excel files (xlsx)
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(null, false);
        }
      },
    }),
  )
  @UseGuards(AdminGuard)
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const workbook = new Excel.Workbook();
      const buffer = file.buffer;
      await workbook.xlsx.load(buffer);
      const worksheet = workbook.getWorksheet(1);
      const promises = [];

      worksheet.eachRow(async (row, rowNumber) => {
        if (rowNumber === 1) {
          if (
            row.getCell(1).value !== 'username' ||
            row.getCell(2).value !== 'email' ||
            row.getCell(3).value !== 'password'
          ) {
            promises.push(
              Promise.resolve("Your excel didn't respect the format"),
            );
            return;
          }
        } else {
          const professor: ProfessorDto = {
            _id: new Types.ObjectId(),
            username: 'professor',
            email: 'professor@example.com',
            password: 'password',
            profileImage: 'http://localhost:3000/default/img',
            role: 'professor',
            studentList: [],
            colaborationId: [],
            coursesId: [],
          };

          professor.username = row.getCell(1).value.toString();

          const emailValue =
            typeof row.getCell(2).value === 'string'
              ? row.getCell(2).value
              : JSON.parse(JSON.stringify(row.getCell(2).value));
          const email =
            emailValue.text === undefined ? emailValue : emailValue.text;
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          if (!emailRegex.test(email)) {
            promises.push(Promise.resolve('Invalid email format'));
            return;
          }

          professor.password = row.getCell(3).value.toString();
          professor.email = email;
          const promise = this.adminService.addNewProfessor(professor);
          promises.push(promise);
        }
      });

      const results = await Promise.all(promises);
      return results.filter((result) => result !== true);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
