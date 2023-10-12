import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CursDto } from 'src/Schemas/DTO/curs.dto';
import { ICompilators } from 'src/Schemas/Entity/ICompilators';
import { ICurs } from 'src/Schemas/Entity/ICurs';
import { IPdf } from 'src/Schemas/Entity/IPdf';
import { IVideo } from 'src/Schemas/Entity/IVideo';

@Injectable()
export class CursService {
  constructor(@InjectModel('Curs') private cursModel: Model<ICurs>) {}
  async createCurs(createCursDto: CursDto): Promise<ICurs> {
    const newCurs = await new this.cursModel(createCursDto);
    return newCurs.save();
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
