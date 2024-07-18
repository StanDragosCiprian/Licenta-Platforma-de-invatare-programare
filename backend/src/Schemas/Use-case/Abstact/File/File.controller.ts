import { Get } from '@nestjs/common';
import { Constructor } from 'EnviormentVariable';

export function DataAudit<TBase extends Constructor>(Base: TBase) {
  abstract class FileEndpoint extends Base {
    abstract test: string;
    @Get('test')
    public async t() {
      return 'mere';
    }
  }
  return FileEndpoint;
}
export class EmptyClass {}
