import { Module } from '@nestjs/common';
import { DocsController } from './docs.controller';
import { DocsService } from './docs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesSchema } from 'src/Schemas/Entity.schema/courses.schema';
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
  controllers: [DocsController],
  providers: [DocsService],
})
export class DocsModule {}
