import {
  Body,
  Controller,
  Post,
  Get,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  Res,
  Param,
} from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { Cookies } from 'src/Cookie/cookie';
import { ProfessorGuard } from 'src/auth/professor.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmailAlreadyExistsException } from '../ErrorInterceptor';
import { Response } from 'express';
import { UserController } from '../Abstact/User/user.controller';
import { JwtService } from '@nestjs/jwt';
import { IProfile } from 'src/Schemas/Entity/IProfile';
import { FileHandle, IFileHandle } from '../HandleControllersEntity/FileHandle';
import { EmptyClass, Profile } from '../Abstact/Profile/Profile.controller';
const fileHandle: IFileHandle = new FileHandle();
@Controller('professor')
export class ProfessorController
  extends Profile(UserController(EmptyClass))
  implements IProfile
{
  user: ProfessorService;
  jwt: JwtService;

  constructor(private readonly professorService: ProfessorService) {
    super();
    this.user = this.professorService;
  }
  @Post('/update/username')
  @UseGuards(ProfessorGuard)
  async updateUsername(
    @Body() body: any,
    @Cookies('id') id: string,
  ): Promise<boolean> {
    return await this.updateUsernameLogic(body, id, 'username');
  }

  @Post('/is/email/exist')
  async isEmailExist(@Body() body: { email: string }, @Res() res: Response) {
    try {
      const isEmail = await this.professorService.isEmailExist(body.email);
      if (isEmail) {
        throw new EmailAlreadyExistsException();
      }
      return res.status(200).send(true);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  @Post('/update/email')
  @UseGuards(ProfessorGuard)
  async updateEmail(@Body() body: any, @Cookies('id') id: string) {
    return await this.updateUsernameLogic(body, id, 'email');
  }
  @Post('/update/password')
  @UseGuards(ProfessorGuard)
  async updatePassword(@Body() body: any, @Cookies('id') id: string) {
    return await this.updateUsernameLogic(body, id, 'password');
  }
  @Get('profile/:name/:format')
  updateProfileImage(
    @Res() response,
    @Param('name') name: string,
    @Param('format') format: string,
  ) {
    try {
      response.sendFile(
        `E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Image\\Profile\\Professor\\${name}.${format}`,
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  @Post('/upload/profile/image')
  @UseGuards(ProfessorGuard)
  @UseInterceptors(
    //Professor
    FileInterceptor('image', fileHandle.imageSetting('Professor')),
  )
  async upload(@UploadedFile() file, @Cookies('id') id: string) {
    return this.updateImageBuilder(file, id, 'professor');
  }
  @Get('/get/email/encripted')
  @UseGuards(ProfessorGuard)
  async getEmailEncrypted(@Cookies('id') id: string) {
    try {
      const professor = await this.getUser(id);
      return this.professorService.encryptProfessor(professor.email);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get('/isProfessor')
  async verifyAdmin(@Cookies('id') id: string): Promise<boolean> {
    try {
      const decodedToken = await this.professorService.decriptJwt(id);
      const professor = await this.professorService.getUserById(decodedToken);

      if (professor === null) {
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
