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
import { UserController } from '../Abstact/User/user.controller';
import { EmptyClass, Profile } from '../Abstact/Profile/Profile.controller';
import { FileHandle, IFileHandle } from '../HandleControllersEntity/FileHandle';
const fileHandle: IFileHandle = new FileHandle();
@Controller('student')
export class StudentController extends Profile(UserController(EmptyClass)) {
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
  @UseInterceptors(FileInterceptor('image', fileHandle.imageSetting('Student')))
  async upload(@UploadedFile() file, @Cookies('id') id: string) {
    return this.updateImageBuilder(file, id, 'student');
  }
  @Post('/update/username')
  @UseGuards(StudentGuard)
  async updateUsername(@Body() body: any, @Cookies('id') id: string) {
    return await this.updateUsernameLogic(body, id, 'username');
  }
  @Post('/update/email')
  @UseGuards(StudentGuard)
  async updateEmail(@Body() body: any, @Cookies('id') id: string) {
    return await this.updateUsernameLogic(body, id, 'email');
  }
  @Post('/update/password')
  @UseGuards(StudentGuard)
  async updatePassword(@Body() body: any, @Cookies('id') id: string) {
    return await this.updateUsernameLogic(body, id, 'password');
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
