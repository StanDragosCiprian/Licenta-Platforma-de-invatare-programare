import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfesorSchema } from 'src/Schemas/Entity.schema/professor.schema';
import { ProfessorController } from './professor.controller';
import { ProfessorService } from './professor.service';
import { JwtModule } from '@nestjs/jwt';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Professor', schema: ProfesorSchema }]),
    StudentModule,
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [ProfessorController],
  providers: [ProfessorService],
  exports: [ProfessorService],
})
export class ProfessorModule {}
