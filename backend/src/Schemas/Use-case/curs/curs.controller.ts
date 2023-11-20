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
import { CursDto } from 'src/Schemas/DTO/curs.dto';
import { CursService } from './curs.service';
import { IVideo } from 'src/Schemas/Entity/IVideo';
import { ErrorInterceptor } from '../ErrorInterceptor';
import { IPdf } from 'src/Schemas/Entity/IPdf';
import { ICompilators } from 'src/Schemas/Entity/ICompilators';
import { ResponseStatus } from 'src/Schemas/Use-case/ResponseStatus';
import { Cookies } from 'src/Cookie/cookie';
import { ProfessorGuard } from 'src/auth/professor.guard';
@Controller('curs')
export class CursController {
  constructor(private cursService: CursService) {}
  private resp = new ResponseStatus();
  @Post('/new')
  @UseGuards(ProfessorGuard)
  async createCurs(
    @Cookies() id,
    @Body() createCursDto: CursDto,
  ): Promise<any> {
    console.log(id);
    console.log(createCursDto);

    const newCurs = await this.cursService.createNewCourse(
      createCursDto,
      id.id,
    );
    return newCurs;
  }

  @Get('/:coursName')
  async getCoursName(@Param('coursName') coursId: string) {
    console.log('coursId: ', coursId);
    const name = await this.cursService.takeName(coursId);
    return name;
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
