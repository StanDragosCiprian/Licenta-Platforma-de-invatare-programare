import { Body } from '@nestjs/common';
import { Constructor } from 'EnviormentVariable';
import { Cookies } from 'src/Cookie/cookie';
import { StudentService } from '../../student/student.service';
import { ProfessorService } from '../../professor/professor.service';
import * as fs from 'fs';
export function Profile<TBase extends Constructor>(Base: TBase) {
  abstract class ProfileAbstract extends Base {
    abstract user: StudentService | ProfessorService;
    async updateUsernameLogic(
      @Body() body: any,
      @Cookies('id') id: string,
      whatToUpdate: string,
    ) {
      try {
        const professor = await this.user.getUserById(
          await this.user.decriptJwt(id),
        );
        if (professor.email === body.email) {
          return await this.user.updateUserParam(
            body.email,
            body.newValue,
            whatToUpdate,
          );
        }
        return false;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
    public async updateImageBuilder(
      file: any,
      cookie: any,
      nameDirection: string,
    ) {
      try {
        const user = await this.deleteImage(nameDirection, cookie);
        const test = this.extractFilenameParts(file.path);
        user.profileImage = `http://localhost:3000/${nameDirection}/profile/${test[0]}/${test[1]}`;
        await user.save();
        return { path: true };
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
    public async deleteImage(nameDirection: string, cookie: any) {
      const professor: any = await this.user.getUser(cookie);
      if (professor.profileImage !== 'http://localhost:3000/default/img') {
        professor.profileImage = professor.profileImage.replace(
          `http://localhost:3000/${nameDirection}/profile`,
          `E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Image\\Profile\\${
            nameDirection[0].toUpperCase() + nameDirection.slice(1)
          }\\`,
        );
        professor.profileImage = professor.profileImage.replace(/[/\\]/g, '\\');
        const profileImage = professor.profileImage.replace(/\\jpg$/, '.jpg');

        fs.unlinkSync(profileImage);
      }
      return professor;
    }
    public extractFilenameParts(imagePath: string): string[] {
      const parts = imagePath.split(/\/|\\/);
      const filename = parts.pop() || '';
      const filenameParts = filename.split('.');
      return filenameParts;
    }
  }

  return ProfileAbstract;
}
export class EmptyClass {}
