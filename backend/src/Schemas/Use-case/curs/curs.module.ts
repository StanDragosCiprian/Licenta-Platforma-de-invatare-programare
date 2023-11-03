import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CursSchema } from 'src/Schemas/Entity.schema/curs.schema';
import { CursController } from './curs.controller';
import { CursService } from './curs.service';
import { ProfessorModule } from '../professor/professor.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Curs', schema: CursSchema }]),
    ProfessorModule,
  ],
  controllers: [CursController],
  providers: [CursService],
})
export class ContentModule {}
