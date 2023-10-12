import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { CursDto } from 'src/Schemas/DTO/curs.dto';
import { CursService } from './curs.service';
// import { IPdf } from 'src/Schemas/Entity/IPdf';
import { IVideo } from 'src/Schemas/Entity/IVideo';
import { ErrorInterceptor } from '../Excetion';
import { IPdf } from 'src/Schemas/Entity/IPdf';
import { ICompilators } from 'src/Schemas/Entity/ICompilators';
@Controller('curs')
export class CursController {
  constructor(private cursService: CursService) {}
  private videoKeys: (keyof IVideo)[] = ['videoPath', 'title', 'descrition'];
  private pdfKeys: (keyof IPdf)[] = ['pdfPath', 'pdfName'];
  private compilatorKeys: (keyof ICompilators)[] = [
    'problemName',
    'problemRequire',
    'problemInputs',
    'problemOutputs',
    'funtionProblemModel',
  ];
  hasSameKeys(obj: any, mykeys: (keyof any)[]): boolean {
    return mykeys.every((key) => key in obj);
  }
  myGodResponse(response: any, test: any) {
    return response.status(HttpStatus.CREATED).json({
      message: 'Request made with success',
      newStudent: test,
    });
  }
  myBadResponse(response: any) {
    return response.status(HttpStatus.CREATED).json({
      message: 'Bad imputs',
    });
  }
  @Post('/new')
  @UseInterceptors(ErrorInterceptor)
  async createCurs(@Res() response, @Body() createCursDto: CursDto) {
    const newCurs = await this.cursService.createCurs(createCursDto);
    return this.myGodResponse(response, newCurs);
  }

  @Post('/new/video')
  @UseInterceptors(ErrorInterceptor)
  async createVideoCurs(@Res() response, @Body() video: IVideo) {
    if (this.hasSameKeys(video, this.videoKeys)) {
      const newVideo = await this.cursService.addVideoToCurs(
        '6528206c40e8e31219a642a2',
        video,
      );
      return this.myGodResponse(response, newVideo);
    }
    return this.myBadResponse(response);
  }

  @Post('/new/pdf')
  @UseInterceptors(ErrorInterceptor)
  async createPdfCurs(@Res() response, @Body() PdfDto: IPdf) {
    if (this.hasSameKeys(PdfDto, this.pdfKeys)) {
      const newCurs = await this.cursService.addPdfToCurs(
        '6528206c40e8e31219a642a2',
        PdfDto,
      );
      return this.myGodResponse(response, newCurs);
    }
    return this.myBadResponse(response);
  }
  @Post('/new/compilator')
  @UseInterceptors(ErrorInterceptor)
  async createCompilatorCurs(
    @Res() response,
    @Body() compilatorDto: ICompilators,
  ) {
    if (this.hasSameKeys(compilatorDto, this.compilatorKeys)) {
      const newCompilator = await this.cursService.addCompilatorToCurs(
        '6528206c40e8e31219a642a2',
        compilatorDto,
      );
      return this.myGodResponse(response, newCompilator);
    }
    return this.myBadResponse(response);
  }
}
