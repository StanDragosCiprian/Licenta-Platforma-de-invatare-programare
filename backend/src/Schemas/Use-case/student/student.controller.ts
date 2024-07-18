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
import { JwtService } from '@nestjs/jwt';
import { Cookies } from 'src/Cookie/cookie';
import { StudentGuard } from 'src/auth/student.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { IStudent } from 'src/Schemas/Entity/IStudent';
import * as fs from 'fs';
import { UserController } from '../Abstact/User/user.controller';
import { EmptyClass } from '../Abstact/File/File.controller';
@Controller('student')
export class StudentController extends UserController(EmptyClass) {
  user: StudentService;
  jwt: JwtService;
  constructor(
    private readonly studentService: StudentService,
    private jwtService: JwtService,
  ) {
    super();
    this.user = this.studentService;
    this.jwt = jwtService;
  }
  @Get('profile/:name/:format')
  async studentProfileImage(
    @Res() response,
    @Param('name') name: string,
    @Param('format') format: string,
  ) {
    try {
      response.sendFile(
        `E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Image\\Profile\\Student\\${name}.${format}`,
      );
    } catch (error) {
      console.error(error);
      response.status(500).send('Internal Server Error');
    }
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
    try {
      const student: IStudent = await this.getUser(id);
      if (student.profileImage !== 'http://localhost:3000/default/img') {
        student.profileImage = student.profileImage.replace(
          'http://localhost:3000/student/profile/',
          'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Image\\Profile\\Student\\',
        );
        student.profileImage = student.profileImage.replace(/[/\\]/g, '\\');
        const profileImage = student.profileImage.replace(/\\jpg$/, '.jpg');

        fs.unlinkSync(profileImage);
      }
      const test = this.extractFilenameParts(file.path);
      student.profileImage = `http://localhost:3000/student/profile/${test[0]}/${test[1]}`;
      await student.save();
      return { path: true };
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
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
    try {
      const student = await this.getUser(id);
      if (student.email === body.email) {
        return await this.studentService.updateUsername(
          body.email,
          body.newValue,
        );
      }
      return false;
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  }
  @Post('/update/email')
  @UseGuards(StudentGuard)
  async updateEmail(@Body() body: any, @Cookies('id') id: string) {
    try {
      const student = await this.getUser(id);
      if (student.email === body.email) {
        return await this.studentService.updateEmail(body.email, body.newValue);
      }
      return false;
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  }
  @Post('/update/password')
  @UseGuards(StudentGuard)
  async updatePassword(@Body() body: any, @Cookies('id') id: string) {
    try {
      const student = await this.getUser(id);
      if (student.email === body.email) {
        return await this.studentService.updatePassword(
          body.email,
          body.newValue,
        );
      }
      return false;
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  }

  @Get('/isStudent')
  async verifyAdmin(@Cookies('id') id: string): Promise<boolean> {
    try {
      const decodedToken = await this.studentService.decriptJwt(id);
      const student = await this.studentService.getUserById(decodedToken);

      if (student === null) {
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
