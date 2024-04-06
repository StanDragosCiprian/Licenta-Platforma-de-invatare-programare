import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFile,
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

@Controller('admin')
export class AdminsController {
  constructor(
    private readonly adminService: AdminsService,
    private jwtService: JwtService,
  ) {}
  @Get('/all/students')
  @UseGuards(AdminGuard)
  async getAllStudents() {
    const students = await this.adminService.getAllStudents();
    return students.map((student) => {
      return { username: student.username, email: student.email };
    });
  }
  @Post('/switch/professor/courses')
  @UseGuards(AdminGuard)
  async switchProfessorCourses(
    @Body() professor: { email1: string; email2: string },
  ) {
    await this.adminService.switchProfessorCourses(
      professor.email1,
      professor.email2,
    );
  }

  @Post('/delete/professor')
  @UseGuards(AdminGuard)
  async deleteProfessor(@Body() professor: { email: string }) {
    return await this.adminService.deleteProfessor(professor.email);
  }
  @Post('/delete/student')
  @UseGuards(AdminGuard)
  async deleteStudent(@Body() student: { email: string }) {
    return await this.adminService.deleteStudents(student.email);
  }
  @Get('/all/professors')
  @UseGuards(AdminGuard)
  async getAllProfessor() {
    const allProfessors = await this.adminService.getAllProfessors();
    return allProfessors.map((professor) => {
      return { username: professor.username, email: professor.email };
    });
  }
  @Post('/log')
  async logAdmin(@Body() log: LogDto): Promise<{ access_token: string }> {
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
  }
  @Get('/get')
  @UseGuards(AdminGuard)
  async getProfessor(@Cookies('id') id: string): Promise<IAdmin | string> {
    const decodedToken = await this.adminService.decriptJwt(id);
    const admin = this.adminService.getAdmin(decodedToken);
    if (admin === null) {
      return ' ';
    }
    return admin;
  }
  @Get('/isAdmin')
  async verifyAdmin(@Cookies('id') id: string): Promise<boolean> {
    const decodedToken = await this.adminService.decriptJwt(id);
    const admin = await this.adminService.getAdmin(decodedToken);

    if (admin === null) {
      return false;
    }
    return true;
  }

  @Post('/exel')
  @UseInterceptors(
    FileInterceptor('file', {
      // storage: diskStorage({
      //   destination: './uploads',
      //   filename: (req, file, cb) => {
      //     const name = file.originalname.split('.')[0];
      //     const fileExtension = file.originalname.split('.')[1];
      //     const newFileName =
      //       name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;
      //     cb(null, newFileName);
      //   },
      // }),
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
    const workbook = new Excel.Workbook();
    const buffer = file.buffer;
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(1);

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) {
        const professor: ProfessorDto = {
          _id: new Types.ObjectId(),
          username: 'professor',
          email: 'professor@example.com',
          password: 'password',
          profileImage: 'http://localhost:3000/default/img',
          role: 'professor',
          studentList: [],
          colaborationId: [],
          coursesId: [new Types.ObjectId()],
        };

        professor.username = row.getCell(1).value.toString();

        const email =
          typeof row.getCell(2).value === 'string'
            ? row.getCell(2).value
            : JSON.parse(JSON.stringify(row.getCell(2).value));
        professor.password = row.getCell(3).value.toString();
        professor.email = email.text === undefined ? email : email.text;
        this.adminService.addNewProfessor(professor);
      }
    });
  }
}
