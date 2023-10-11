import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CursSchema } from 'src/Schemas/Entity.schema/curs.schema';
import { CursController } from './curs.controller';
import { CursService } from './curs.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Curs', schema: CursSchema }])],
  controllers: [CursController],
  providers: [CursService],
})
export class ContentModule {}
