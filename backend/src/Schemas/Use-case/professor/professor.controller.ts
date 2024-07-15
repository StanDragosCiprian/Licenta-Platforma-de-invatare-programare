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
import { ProfessorDto } from 'src/Schemas/DTO/professir.dto';
import { Cookies } from 'src/Cookie/cookie';
import { ProfessorGuard } from 'src/auth/professor.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { IProfessor } from 'src/Schemas/Entity/IProfessor';
import { EmailAlreadyExistsException } from '../ErrorInterceptor';
import { Response } from 'express';
import * as fs from 'fs';
import { UserController } from '../Abstact/user.controller';
import { JwtService } from '@nestjs/jwt';
@Controller('professor')
export class ProfessorController extends UserController {
  user: ProfessorService;
  jwt: JwtService;
  constructor(private readonly professorService: ProfessorService) {
    super();
    this.user = this.professorService;
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
  @Post('/update/username')
  @UseGuards(ProfessorGuard)
  async updateUsername(@Body() body: any, @Cookies('id') id: string) {
    try {
      const professor = await this.professorService.getUserById(
        await this.professorService.decriptJwt(id),
      );
      if (professor.email === body.email) {
        return await this.professorService.updateUsername(
          body.email,
          body.newValue,
        );
      }
      return false;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  @Post('/update/email')
  @UseGuards(ProfessorGuard)
  async updateEmail(@Body() body: any, @Cookies('id') id: string) {
    try {
      const professor = await this.professorService.getUserById(
        await this.professorService.decriptJwt(id),
      );
      if (professor.email === body.email) {
        return await this.professorService.updateEmail(
          body.email,
          body.newValue,
        );
      }
      return false;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  @Post('/update/password')
  @UseGuards(ProfessorGuard)
  async updatePassword(@Body() body: any, @Cookies('id') id: string) {
    try {
      const professor = await this.professorService.getUserById(
        await this.professorService.decriptJwt(id),
      );
      if (professor.email === body.email) {
        return await this.professorService.updatePassword(
          body.email,
          body.newValue,
        );
      }
      return false;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  @Get('profile/:name/:format')
  studentProfileImage(
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
      const professor: IProfessor = await this.getUser(id);
      if (professor.profileImage !== 'http://localhost:3000/default/img') {
        professor.profileImage = professor.profileImage.replace(
          'http://localhost:3000/professor/profile',
          'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Image\\Profile\\Professor\\',
        );
        professor.profileImage = professor.profileImage.replace(/[/\\]/g, '\\');
        const profileImage = professor.profileImage.replace(/\\jpg$/, '.jpg');

        fs.unlinkSync(profileImage);
      }
      const test = this.extractFilenameParts(file.path);
      professor.profileImage = `http://localhost:3000/professor/profile/${test[0]}/${test[1]}`;
      await professor.save();
      return { path: true };
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
