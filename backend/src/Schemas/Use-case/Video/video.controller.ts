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
import { FileHandle, IFileHandle } from '../HandleControllersEntity/FileHandle';
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
  @Get('/:professorName/:courseName/:videoName/:extension/get/video')
  async getVideo(
    @Res() response,
    @Param('professorName') professorName: string,
    @Param('courseName') courseName: string,
    @Param('videoName') videoName: string,
    @Param('extension') extension: string,
  ) {
    try {
      response.sendFile(
        `${FILELOCATION}\\backend\\src\\VideoTutorial\\${professorName}\\${courseName}\\${videoName}.${extension}`,
      );
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while fetching the video.');
    }
  }
  @Post('/:professorName/:courseName/add/video/videoInput')
  @UseGuards(ProfessorGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage(fileHandle.destinationVideo()),
      fileFilter: fileHandle.filterVideo(),
    }),
  )
  async addVideoForVideoCourses(
    @Req() req: Request,
    @Cookies('id') id: string,
    @Body('filename') filename: string,
    @Param('professorName') professorName: string,
    @Param('courseName') courseName: string,
  ) {
    try {
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
    } catch (error) {
      console.error(error);
      throw new Error(
        'An error occurred while adding the video for the video course.',
      );
    }
  }
  @Post('/:courseName/add/video/textInput')
  @UseGuards(ProfessorGuard)
  async createTextForVideoCourses(
    @Param('courseName') courseNameId: string,
    @Body() createCourseDto: IVideo,
  ): Promise<string> {
    try {
      const courseId: Types.ObjectId =
        await this.videoService.takeCoursId(courseNameId);
      const videoDto = createCourseDto;
      videoDto.format = 'Video';
      const courses = await this.videoService.addMediaFormat(
        courseId,
        videoDto,
      );
      return await courses.toString();
    } catch (error) {
      console.error(error);
      throw new Error(
        'An error occurred while creating the text for the video course.',
      );
    }
  }
  @Get('/coursesProfessor/:courseName/video')
  async coursesProfessorVideo(
    @Cookies('id') id: string,
    @Param('courseName') courseName: string,
  ) {
    try {
      const video: IVideo[] | IDocumentFormat[] =
        await this.videoService.getProfessorMedia(id, courseName);
      return video;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while fetching the professor videos.');
    }
  }
  @Post('/:professorName/:videName/:coursName/add/video/Update/videoInput')
  @UseGuards(ProfessorGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage(fileHandle.destinationVideo()),
      fileFilter: fileHandle.filterVideo(),
    }),
  )
  async updateVideoForVideoCourses(
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
    try {
      fs.unlinkSync(
        `${FILELOCATION}\\backend\\src\\VideoTutorial\\${videoPathString}`,
      );
      return `${professorName}/${coursName}/${filename}`;
    } catch (error) {
      console.error(error);
      throw new Error(
        'An error occurred while updating the video for the video course.',
      );
    }
  }
  @Post('/:coursName/:videoName/update/video')
  @UseGuards(ProfessorGuard)
  async updateVideo(
    @Cookies('id') id: string,
    @Body() file: IVideo,
    @Param('coursName') coursName: string,
    @Param('videoName') videoName: string,
  ) {
    try {
      await this.videoService.updateVideoFromCourse(
        file,
        videoName,
        id,
        coursName,
      );
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while updating the video.');
    }
  }
}
