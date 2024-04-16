import { Module } from '@nestjs/common';
import { CompilatorController } from './compilator.controller';
import { CompilatorService } from './compilator.service';
import { JwtModule } from '@nestjs/jwt';
import { ProfessorModule } from '../professor/professor.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesSchema } from 'src/Schemas/Entity.schema/courses.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Courses', schema: CoursesSchema }]),
    ProfessorModule,
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [CompilatorController],
  providers: [CompilatorService],
})
export class CompilatorModule {}
