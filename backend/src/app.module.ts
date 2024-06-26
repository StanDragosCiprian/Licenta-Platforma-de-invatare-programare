import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from './Schemas/Use-case/student/student.module';
import { ProfessorModule } from './Schemas/Use-case/professor/professor.module';
import { ContentModule } from './Schemas/Use-case/courses/courses.module';
import { AdminsModule } from './Schemas/Use-case/admins/admins.module';
import { VideoModule } from './Schemas/Use-case/Video/video.module';
import { DocsModule } from './Schemas/Use-case/Pdf/docs.module';
import { CompilatorModule } from './Schemas/Use-case/Compilator/compilator.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/?directConnection=true', {
      dbName: 'ProgramingLandb',
    }),
    StudentModule,
    ProfessorModule,
    ContentModule,
    AdminsModule,
    VideoModule,
    DocsModule,
    CompilatorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
