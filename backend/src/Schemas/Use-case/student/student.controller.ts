import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentDto } from '../../DTO/student.dto';

import { ResponseStatus } from 'src/Schemas/Use-case/ResponseStatus';
import { LogDto } from 'src/Schemas/DTO/log.dto';
import { JwtService } from '@nestjs/jwt';
import { Cookies } from 'src/Cookie/cookie';
import { StudentGuard } from 'src/auth/student.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { IStudent } from 'src/Schemas/Entity/IStudent';
import { EmailAlreadyExistsException } from '../ErrorInterceptor';

@Controller('student')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private jwtService: JwtService,
  ) {}
  private resp = new ResponseStatus();
  @Post('/new')
  async createStudent(
    @Body() createStudentDto: StudentDto,
  ): Promise<{ access_token: string }> {
    try {
      const newStudent =
        await this.studentService.createStudent(createStudentDto);
      const payload = { sub: newStudent._id };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (e) {
      throw new EmailAlreadyExistsException();
    }
  }
  @Get('profile/:name/:format')
  studentProfileImage(
    @Res() response,
    @Param('name') name: string,
    @Param('format') format: string,
  ) {
    response.sendFile(
      `E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Image\\Profile\\Student\\${name}.${format}`,
    );
  }
  @Post('/upload/profile/image')
  @UseGuards(StudentGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination:
          'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Image\\Profile\\Student',
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
    const student: IStudent = await this.getStudent(id);
    const test = this.extractFilenameParts(file.path);
    student.profileImage = `http://localhost:3000/student/profile/${test[0]}/${test[1]}`;
    student.save();
    return { path: true };
  }
  private extractFilenameParts(imagePath: string): string[] {
    const parts = imagePath.split(/\/|\\/);
    const filename = parts.pop() || '';
    const filenameParts = filename.split('.');
    return filenameParts;
  }
  @Post('/update/username')
  @UseGuards(StudentGuard)
  async updateUsername(@Body() body: any, @Cookies('id') id: string) {
    const student = await this.getStudent(id);
    if (student.email === body.email) {
      return await this.studentService.updateUsername(
        body.email,
        body.newValue,
      );
    }
    return false;
  }
  @Post('/update/email')
  @UseGuards(StudentGuard)
  async updateEmail(@Body() body: any, @Cookies('id') id: string) {
    const student = await this.getStudent(id);
    if (student.email === body.email) {
      return await this.studentService.updateEmail(body.email, body.newValue);
    }
    return false;
  }
  @Post('/update/password')
  @UseGuards(StudentGuard)
  async updatePassword(@Body() body: any, @Cookies('id') id: string) {
    const student = await this.getStudent(id);
    if (student.email === body.email) {
      return await this.studentService.updatePassword(
        body.email,
        body.newValue,
      );
    }
    return false;
  }
  @Post('/log')
  async logStudent(@Body() log: LogDto): Promise<{ access_token: string }> {
    const logStudent = await this.studentService.logUser(
      log.email,
      log.password,
    );
    return this.studentService.makeJwt(logStudent);
  }
  @Get('get')
  async getStudent(@Cookies('id') id: string): Promise<any> {
    const decodedToken = await this.studentService.decriptJwt(id);
    const student = await this.studentService.getStudent(decodedToken);
    if (student === null) {
      return ' ';
    }
    return student;
  }
}
