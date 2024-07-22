export interface IProfile {
  //@Post('/update/username')
  updateUsername(body: any, cookie: any): Promise<boolean>;
  //  @Post('/update/email')
  updateEmail(body: any, cookie: any): Promise<boolean>;
  updatePassword(body: any, cookie: any): Promise<boolean>;
}
