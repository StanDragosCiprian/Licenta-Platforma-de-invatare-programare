import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CursSchema } from 'src/Schemas/Entity.schema/curs.schema';

import { ProfessorModule } from '../professor/professor.module';
import { JwtModule } from '@nestjs/jwt';
import { VideoServices } from './video.service';
import { VideoController } from './video.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Curs', schema: CursSchema }]),
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
