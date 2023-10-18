import { HttpStatus } from '@nestjs/common';
import { IVideo } from '../Entity/IVideo';
import { IPdf } from '../Entity/IPdf';
import { ICompilators } from '../Entity/ICompilators';

export class ResponseStatus {
  public videoKeys: (keyof IVideo)[] = ['videoPath', 'title', 'descrition'];
  public pdfKeys: (keyof IPdf)[] = ['pdfPath', 'pdfName'];
  public compilatorKeys: (keyof ICompilators)[] = [
    'problemName',
    'problemRequire',
    'problemInputs',
    'problemOutputs',
    'funtionProblemModel',
  ];
  public hasSameKeys(obj: any, mykeys: (keyof any)[]): boolean {
    return mykeys.every((key) => key in obj);
  }
  public goodResponse(response: any, user: any) {
    return response.status(HttpStatus.CREATED).json({
      message: 'Request made with success',
      entity: user,
    });
  }
  public badResponse(response: any) {
    return response.status(HttpStatus.CREATED).json({
      message: 'Bad imputs',
    });
  }
}
