import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesSchema } from 'src/Schemas/Entity.schema/courses.schema';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { ProfessorModule } from '../professor/professor.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Courses', schema: CoursesSchema }]),
    ProfessorModule,
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class ContentModule {}
