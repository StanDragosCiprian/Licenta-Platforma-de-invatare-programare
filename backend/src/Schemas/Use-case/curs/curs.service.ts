import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
  async takeCours(cursName: string): Promise<Types.ObjectId> {
    return (await this.cursModel.findOne({ name: cursName }))._id;
  }
  async getProfessorNameForCours(id: string): Promise<string> {
    return this.professorService.getProfessorName(id);
  }
  onModuleInit() {
    this.cursModel.watch().on('change', (change) => {
      console.log(change);
    });
  }
  async addVideoToVide(cursId: Types.ObjectId, video: IVideo) {
    const curs: ICurs = await this.cursModel.findById(cursId);
    curs.curs.push(video);
    curs.save();
    return curs.curs.lastIndexOf;
  }
  async getCoursComponent(): Promise<ICurs[]> {
    const professorCoursId: Set<Types.ObjectId> =
      await this.professorService.getAllProfessorsCursId();

    const courses: ICurs[] = [];
    for (const c of professorCoursId) {
      const cours: ICurs = await this.cursModel.findById(c);
      console.log('cours: ', cours.vizibility);
      if (cours?.vizibility === true) {
        courses.push(cours);
      }
    }
    return courses;
  }

  async createNewCourse(curse: CursDto, professorId: string) {
    const newCurs = await new this.cursModel(curse);
    newCurs.save();
    const decryptId = await this.professorService.decriptJwt(professorId);
    const professor = await this.professorService.getProfessor(decryptId);
    professor.coursesId.push(newCurs._id);
    professor.save();
    return newCurs.name;
  }
  async takeName(cursId: string): Promise<string> {
    const name = await this.cursModel.findById(cursId);
    return name.name;
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
