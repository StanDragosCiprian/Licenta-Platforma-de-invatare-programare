import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VideoServices } from './video.service';
import { FileHandle, IFileHandle } from '../curs/FileHandle';
import { FILELOCATION } from 'EnviormentVariable';
import { ProfessorGuard } from 'src/auth/professor.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Cookies } from 'src/Cookie/cookie';
import { IVideo } from 'src/Schemas/Entity/IVideo';
import { Types } from 'mongoose';
import { IDocumentFormat } from 'src/Schemas/Entity/IPdf';
import * as fs from 'fs';
const fileHandle: IFileHandle = new FileHandle();
@Controller('/courses/video')
export class VideoController {
  constructor(private videoService: VideoServices) {}

  //   @Get('/:coursName/:id/get/cours')
  //   async getCours(
  //     @Param('coursName') coursName: string,
  //     @Param('id') id: string,
  //   ) {
  //     const name = await this.videoService.takeFullCurs(coursName);
  //     return name.curs[id];
  //   }
  @Get('/:coursName/videoCourse')
  async getCoursFullCurs(@Param('coursName') coursName: string) {
    const name = await this.videoService.takeFullCurs(coursName);
    const m = name.curs.map((cours: any) => {
      return { title: cours.title };
    });
    return m;
  }
  @Get('/:professorName/:cursName/:videoName/:extension/get/video')
  async getVideo(
    @Res() response,
    @Param('professorName') professorName: string,
    @Param('cursName') cursName: string,
    @Param('videoName') videoName: string,
    @Param('extension') extension: string,
  ) {
    response.sendFile(
      `${FILELOCATION}\\backend\\src\\VideoTutorial\\${professorName}\\${cursName}\\${videoName}.${extension}`,
    );
  }
  @Post('/:professorName/:coursName/add/video/videoInput')
  @UseGuards(ProfessorGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage(fileHandle.destinationVideo()),
      fileFilter: fileHandle.filterVideo(),
    }),
  )
  async addVideoForVideoCurs(
    @Req() req: Request,
    @Cookies('id') id: string,
    @Body('filename') filename: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('professorName') professorName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('coursName') coursName: string,
  ) {
    const { dest }: any = req.body;
    const finalDest =
      dest
        .replace(
          'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\VideoTutorial\\',
          '',
        )
        .replace(/\\/g, '/') +
      '/' +
      filename;
    return finalDest;
  }
  @Post('/:coursName/add/video/textInput')
  @UseGuards(ProfessorGuard)
  async createTextForVideoCurs(
    @Param('coursName') coursId: string,
    @Body() createCursDto: IVideo,
  ): Promise<string> {
    const cursId: Types.ObjectId = await this.videoService.takeCoursId(coursId);
    const videoDto = createCursDto;
    videoDto.format = 'Video';
    const curs = await this.videoService.addMediaFormat(cursId, videoDto);
    return await curs.toString();
  }
  @Get('/coursesProfessor/:courseName/video')
  async coursesProfessorVideo(
    @Cookies('id') id: string,
    @Param('courseName') courseName: string,
  ) {
    const video: IVideo[] | IDocumentFormat[] =
      await this.videoService.getProfessorMedia(id, courseName);
    return video;
  }
  @Post('/:professorName/:videName/:coursName/add/video/Update/videoInput')
  @UseGuards(ProfessorGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage(fileHandle.destinationVideo()),
      fileFilter: fileHandle.filterVideo(),
    }),
  )
  async updateVideoForVideoCurs(
    @Cookies('id') id: string,
    @Body('filename') filename: string,
    @Param('professorName') professorName: string,
    @Param('videName') videName: string,
    @Param('coursName') coursName: string,
  ) {
    const videoPath = await this.videoService.getVideoPathFromCourse(
      id,
      coursName,
      videName,
    );
    const videoPathArray = videoPath.split('/');
    const videoPathString = videoPathArray.join('\\');
    fs.unlinkSync(
      `${FILELOCATION}\\backend\\src\\VideoTutorial\\${videoPathString}`,
    );
    return `${professorName}/${coursName}/${filename}`;
  }
  @Post('/:coursName/:videoName/update/video')
  @UseGuards(ProfessorGuard)
  async updateVideo(
    @Cookies('id') id: string,
    @Body() file: IVideo,
    @Param('coursName') coursName: string,
    @Param('videoName') videoName: string,
  ) {
    await this.videoService.updateVideoFromCourse(
      file,
      videoName,
      id,
      coursName,
    );
  }
}
