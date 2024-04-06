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
import { ErrorInterceptor } from '../ErrorInterceptor';
import { ResponseStatus } from 'src/Schemas/Use-case/ResponseStatus';
import { LogDto } from 'src/Schemas/DTO/log.dto';
import { Cookies } from 'src/Cookie/cookie';
import { ProfessorGuard } from 'src/auth/professor.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { IProfessor } from 'src/Schemas/Entity/IProfessor';

@Controller('professor')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}
  private resp = new ResponseStatus();
  @Post('/new')
  @UseInterceptors(ErrorInterceptor)
  async createStudent(
    @Body() createProfessorDto: ProfessorDto,
  ): Promise<{ access_token: string }> {
    const newProfessor =
      await this.professorService.createProfessor(createProfessorDto);
    return this.professorService.makeJwt(newProfessor._id);
  }
  @Post('/log')
  @UseInterceptors(ErrorInterceptor)
  async logProfessor(@Body() log: LogDto): Promise<{ access_token: string }> {
    const user = await this.professorService.logUser(log.email, log.password);
    return this.professorService.makeJwt(user);
  }

  @Post('/update/username')
  @UseGuards(ProfessorGuard)
  async updateUsername(@Body() body: any, @Cookies('id') id: string) {
    const professor = await this.professorService.getProfessor(
      await this.professorService.decriptJwt(id),
    );
    if (professor.email === body.email) {
      return await this.professorService.updateUsername(
        body.email,
        body.newValue,
      );
    }
    return false;
  }
  @Post('/update/email')
  @UseGuards(ProfessorGuard)
  async updateEmail(@Body() body: any, @Cookies('id') id: string) {
    const student = await this.professorService.getProfessor(
      await this.professorService.decriptJwt(id),
    );
    if (student.email === body.email) {
      return await this.professorService.updateEmail(body.email, body.newValue);
    }
    return false;
  }
  @Post('/update/password')
  @UseGuards(ProfessorGuard)
  async updatePassword(@Body() body: any, @Cookies('id') id: string) {
    const student = await this.professorService.getProfessor(
      await this.professorService.decriptJwt(id),
    );
    if (student.email === body.email) {
      return await this.professorService.updatePassword(
        body.email,
        body.newValue,
      );
    }
    return false;
  }
  @Get('profile/:name/:format')
  studentProfileImage(
    @Res() response,
    @Param('name') name: string,
    @Param('format') format: string,
  ) {
    response.sendFile(
      `E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Image\\Profile\\Professor\\${name}.${format}`,
    );
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
    const professor: IProfessor = await this.getProfessor(id);
    const test = this.extractFilenameParts(file.path);
    professor.profileImage = `http://localhost:3000/professor/profile/${test[0]}/${test[1]}`;
    professor.save();
    return { path: true };
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
    const professor = await this.getProfessor(id);
    return this.professorService.encryptProfessor(professor.email);
  }
  @Get('/get')
  @UseInterceptors(ErrorInterceptor)
  async getProfessor(@Cookies('id') id: string): Promise<any> {
    const decodedToken = await this.professorService.decriptJwt(id);
    const professor = await this.professorService.getProfessor(decodedToken);

    if (professor === null) {
      return ' ';
    }
    return professor;
  }

  @Get('/isProfessor')
  async verifyAdmin(@Cookies('id') id: string): Promise<boolean> {
    const decodedToken = await this.professorService.decriptJwt(id);
    const professor = await this.professorService.getProfessor(decodedToken);

    if (professor === null) {
      return false;
    }
    return true;
  }
}
