import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CursSchema } from 'src/Schemas/Entity.schema/curs.schema';
import { CursController } from './courses.controller';
import { CursService } from './courses.service';
import { ProfessorModule } from '../professor/professor.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Curs', schema: CursSchema }]),
    ProfessorModule,
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [CursController],
  providers: [CursService],
})
export class ContentModule {}
