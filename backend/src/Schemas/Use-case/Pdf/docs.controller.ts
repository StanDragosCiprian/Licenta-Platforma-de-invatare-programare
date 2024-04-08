import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Cookies } from 'src/Cookie/cookie';
import { ProfessorGuard } from 'src/auth/professor.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Types } from 'mongoose';
import { IDocumentFormat } from 'src/Schemas/Entity/IPdf';
import { FILELOCATION } from 'EnviormentVariable';
import { DocsService } from './docs.service';
import { FileHandle, IFileHandle } from '../HandleControllersEntity/FileHandle';
import * as fs from 'fs';
const fileHandle: IFileHandle = new FileHandle();

@Controller('/courses/docs')
export class DocsController {
  constructor(private docsService: DocsService) {}
  @Post(
    '/:professorName/:videName/:coursName/:newTitle/add/pdf/Update/pdfInput',
  )
  @UseGuards(ProfessorGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage(fileHandle.destinationVideo()),
      fileFilter: fileHandle.filterDocuments(),
    }),
  )
  async updatePdfFromCourse(
    @Cookies('id') id: string,
    @Body('filename') filename: string,
    @Param('professorName') professorName: string,
    @Param('videName') videName: string,
    @Param('coursName') coursName: string,
    @Param('newTitle') newTitle: string,
  ) {
    const pdfPath = await this.docsService.getPdfPathFromCourse(
      id,
      coursName,
      videName,
    );
    if (filename !== undefined) {
      const pdfPathArray = pdfPath.split('/');
      const pdfPathString = pdfPathArray.join('\\');
      fs.unlinkSync(
        `${FILELOCATION}\\backend\\src\\VideoTutorial\\${pdfPathString}`,
      );
    }
    const pdf: IDocumentFormat = {
      format: 'Pdf',
      title: newTitle,
      documentFormatName:
        filename !== undefined
          ? `${professorName}/${coursName}/${filename}`
          : '',
    };
    await this.docsService.updatePdfFromCourse(pdf, videName, id, coursName);
  }
  @Get('/coursesProfessor/:courseName/get/pdf')
  async coursesProfessorPdf(
    @Cookies('id') id: string,
    @Param('courseName') courseName: string,
  ) {
    const pdf: IDocumentFormat[] = await this.docsService.getProfessorMedia(
      id,
      courseName,
    );
    return pdf;
  }
  @Post('/:professorName/:coursName/:title/add/document/Docs')
  @UseGuards(ProfessorGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage(fileHandle.destinationVideo()),
      fileFilter: fileHandle.filterDocuments(),
    }),
  )
  async createPdfCurs(
    @Body('filename') filename: string,
    @Param('coursName') coursName: string,
    @Param('professorName') professorName: string,
    @Param('title') title: string,
  ) {
    const cursId: Types.ObjectId =
      await this.docsService.takeCoursId(coursName);
    const pdfDto: IDocumentFormat = {
      format: 'Pdf',
      title: `${title}`,
      documentFormatName: `${professorName}/${coursName}/${filename}`,
    };
    const t = await this.docsService.addMediaFormat(cursId, pdfDto);
    console.log('t: ', t);
    return t;
  }
  @Get('/:professorName/:cursName/:pdfName/pdf')
  async getPdf(
    @Res() response,
    @Param('professorName') professorName: string,
    @Param('cursName') cursName: string,
    @Param('pdfName') videoName: string,
  ) {
    response.sendFile(
      `${FILELOCATION}\\backend\\src\\VideoTutorial\\${professorName}\\${cursName}\\${videoName}.pdf`,
    );
  }
}
