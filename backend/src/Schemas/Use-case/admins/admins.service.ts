import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAdmin } from 'src/Schemas/Entity/IAdmin';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel('Admin') private adminModel: Model<IAdmin>,
    private jwtService: JwtService,
  ) {}
  onModuleInit() {
    this.adminModel.watch().on('change', (change) => {
      console.log(change);
    });
  }
  async logUser(email: string, password: string): Promise<IAdmin> {
    const user = await this.adminModel.findOne({
      email: email,
      password: password,
    });
    return user;
  }
  async getAdmin(id: string): Promise<IAdmin> {
    const professor = await this.adminModel.findOne({
      _id: id,
    });
    return professor;
  }
  async decriptJwt(id: string) {
    const decodedToken = this.jwtService.verify(id);
    return decodedToken.sub;
  }
}
