import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CursDto } from 'src/Schemas/DTO/curs.dto';
import { ICurs } from 'src/Schemas/Entity/ICurs';

@Injectable()
export class CursService {
  constructor(@InjectModel('Curs') private cursModel: Model<ICurs>) {}
  async createCurs(createCursDto: CursDto): Promise<ICurs> {
    const newCurs = await new this.cursModel(createCursDto);
    return newCurs.save();
  }
}
