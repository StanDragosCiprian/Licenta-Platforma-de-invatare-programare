import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CursDto } from 'src/Schemas/DTO/curs.dto';
import { ICompilators } from 'src/Schemas/Entity/ICompilators';
import { ICurs } from 'src/Schemas/Entity/ICurs';
import { IPdf } from 'src/Schemas/Entity/IPdf';
import { IVideo } from 'src/Schemas/Entity/IVideo';
import { ProfessorService } from '../professor/professor.service';

@Injectable()
export class CursService {
  @Inject(ProfessorService)
  private readonly professorService: ProfessorService;
  constructor(@InjectModel('Curs') private cursModel: Model<ICurs>) {}

  async createNewCourse(curse: CursDto, professorId: string) {
    const newCurs = await new this.cursModel(curse);
    newCurs.save();
    const decryptId = await this.professorService.decriptJwt(professorId);
    const professor = await this.professorService.getProfessor(decryptId);
    professor.coursesId.push(newCurs._id);
    professor.save();
    return 'Ok';
  }
  async addVideoToCurs(cursId: string, video: IVideo): Promise<ICurs> {
    const mycurs = await this.cursModel.findById(cursId);
    mycurs.curs.push(video);
    return mycurs.save();
  }
  async addPdfToCurs(cursId: string, pdf: IPdf): Promise<ICurs> {
    const mycurs = await this.cursModel.findById(cursId);
    mycurs.curs.push(pdf);
    return mycurs.save();
  }
  async addCompilatorToCurs(
    cursId: string,
    compilators: ICompilators,
  ): Promise<ICurs> {
    const mycurs = await this.cursModel.findById(cursId);
    mycurs.curs.push(compilators);
    return mycurs.save();
  }
}
