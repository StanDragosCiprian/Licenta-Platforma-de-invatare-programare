import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfesorSchema } from 'src/Schemas/Entity.schema/professor.schema';
import { ProfessorController } from './professor.controller';
import { ProfessorService } from './professor.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Professor', schema: ProfesorSchema }]),
  ],
  controllers: [ProfessorController],
  providers: [ProfessorService],
})
export class ProfessorModule {}
