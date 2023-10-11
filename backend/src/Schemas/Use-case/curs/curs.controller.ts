import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CursDto } from 'src/Schemas/DTO/curs.dto';
import { CursService } from './curs.service';

@Controller('curs')
export class CursController {
  constructor(private cursService: CursService) {}
  @Post('/new')
  async createCurs(@Res() response, @Body() createCursDto: CursDto) {
    try {
      const newCurs = await this.cursService.createCurs(createCursDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Student has been created successfully',
        newStudent: newCurs,
      });
    } catch (err) {
      console.error(err);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Student not created!',
        error: 'Bad Request',
      });
    }
  }
}
