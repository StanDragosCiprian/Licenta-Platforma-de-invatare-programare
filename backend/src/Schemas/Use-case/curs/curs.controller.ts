import { Body, Controller, Post, Res, UseInterceptors } from '@nestjs/common';
import { CursDto } from 'src/Schemas/DTO/curs.dto';
import { CursService } from './curs.service';
import { IVideo } from 'src/Schemas/Entity/IVideo';
import { ErrorInterceptor } from '../ErrorInterceptor';
import { IPdf } from 'src/Schemas/Entity/IPdf';
import { ICompilators } from 'src/Schemas/Entity/ICompilators';
import { ResponseStatus } from 'src/Schemas/Use-case/ResponseStatus';
import { Cookies } from 'src/Cookie/cookie';
@Controller('curs')
export class CursController {
  constructor(private cursService: CursService) {}
  private resp = new ResponseStatus();
  @Post('/new')
  @UseInterceptors(ErrorInterceptor)
  async createCurs(
    @Cookies('id') id: any,
    @Body() createCursDto: CursDto,
  ): Promise<any> {
    const newCurs = await this.cursService.createNewCourse(createCursDto, id);
    return newCurs;
  }

  @Post('/new/video')
  @UseInterceptors(ErrorInterceptor)
  async createVideoCurs(@Res() response, @Body() video: IVideo) {
    if (this.resp.hasSameKeys(video, this.resp.videoKeys)) {
      const newVideo = await this.cursService.addVideoToCurs(
        '6528206c40e8e31219a642a2',
        video,
      );
      return this.resp.goodResponse(response, newVideo);
    }
    return this.resp.badResponse(response);
  }

  @Post('/new/pdf')
  @UseInterceptors(ErrorInterceptor)
  async createPdfCurs(@Res() response, @Body() PdfDto: IPdf) {
    if (this.resp.hasSameKeys(PdfDto, this.resp.pdfKeys)) {
      const newCurs = await this.cursService.addPdfToCurs(
        '6528206c40e8e31219a642a2',
        PdfDto,
      );
      return this.resp.goodResponse(response, newCurs);
    }
    return this.resp.badResponse(response);
  }
  @Post('/new/compilator')
  @UseInterceptors(ErrorInterceptor)
  async createCompilatorCurs(
    @Res() response,
    @Body() compilatorDto: ICompilators,
  ) {
    if (this.resp.hasSameKeys(compilatorDto, this.resp.compilatorKeys)) {
      const newCompilator = await this.cursService.addCompilatorToCurs(
        '6528206c40e8e31219a642a2',
        compilatorDto,
      );
      return this.resp.goodResponse(response, newCompilator);
    }
    return this.resp.badResponse(response);
  }
}
