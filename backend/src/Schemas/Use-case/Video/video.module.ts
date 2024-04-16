import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesSchema } from 'src/Schemas/Entity.schema/courses.schema';

import { ProfessorModule } from '../professor/professor.module';
import { JwtModule } from '@nestjs/jwt';
import { VideoServices } from './video.service';
import { VideoController } from './video.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Courses', schema: CoursesSchema }]),
    ProfessorModule,
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [VideoController],
  providers: [VideoServices],
})
export class VideoModule {}
