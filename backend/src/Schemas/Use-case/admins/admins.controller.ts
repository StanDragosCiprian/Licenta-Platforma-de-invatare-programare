import { Body, Controller, Post, Get } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { LogDto } from 'src/Schemas/DTO/log.dto';
import { JwtService } from '@nestjs/jwt';
import { Cookies } from 'src/Cookie/cookie';

@Controller('admin')
export class AdminsController {
  constructor(
    private readonly adminService: AdminsService,
    private jwtService: JwtService,
  ) {}

  @Post('/log')
  async logAdmin(@Body() log: LogDto): Promise<{ access_token: string }> {
    const logAdmin = await this.adminService.logUser(log.email, log.password);
    if (logAdmin !== null) {
      const payload = { sub: logAdmin._id };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
    return {
      access_token: 'No_Admin',
    };
  }
  @Get('/get')
  async getProfessor(@Cookies('id') id: string): Promise<any> {
    const decodedToken = await this.adminService.decriptJwt(id);
    const professor = this.adminService.getAdmin(decodedToken);
    if (professor === undefined) {
      return 'No_Professor';
    }
    return professor;
  }
}
